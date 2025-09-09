# frozen_string_literal: true
class AandelenController < ApplicationController
  requires_plugin 'aandelen-discourse'

  before_action :ensure_logged_in

  # GET /aandelen/balance.json
  def balance
    render json: { balance: current_user.aandelen_balance || 0 }
  end

  # POST /aandelen/transfer.json
  def transfer
    require_dependency "#{Rails.root}/plugins/aandelen-discourse/app/models/aandelen_transaction"

    receiver = User.find_by(username: params[:username])
    amount = params[:amount].to_i
    description = params[:description].presence || ""

    # --- Validaties ---
    if amount <= 0
      return render json: { success: false, errors: ["Aantal aandelen moet groter dan 0 zijn"] }
    end
    if receiver.nil?
      return render json: { success: false, errors: ["Gebruiker niet gevonden"] }
    end
    if receiver.id == current_user.id
      return render json: { success: false, errors: ["Je kunt geen aandelen naar jezelf sturen"] }
    end
    if current_user.aandelen_balance < amount
      return render json: { success: false, errors: ["Niet genoeg aandelen"] }
    end

    ActiveRecord::Base.transaction do
      # --- Transactie verwerken ---
      current_user.update!(aandelen_balance: current_user.aandelen_balance - amount)
      receiver.update!(aandelen_balance: receiver.aandelen_balance + amount)

      AandelenTransaction.create!(
        sender: current_user,
        receiver: receiver,
        amount: amount,
        description: description
      )

      # --- START BERICHTEN LOGICA ---

      # 1. Bericht voor de ONTVANGER (anoniem)
      receiver_pm_topic = find_or_create_shares_pm(receiver)
      
      receiver_log_entry = "Een gentleman heeft u zojuist **#{amount} aandelen** gegeven.\n\n"
      receiver_log_entry += "*Omschrijving: #{description}*" if description.present?
      
      receiver_pm_topic.add_moderator_post(
        Discourse.system_user,
        receiver_log_entry,
        bump: false,
        post_type: Post.types[:small_action],
        action_code: "aandelen.received"
      )

      # 2. Bericht voor de VERZENDER (met details)
      gentleman_phrases = [
  # Klassiek & Formeel
  "Heel Gentleman van je!",
  "Wat een gulle daad.",
  "Je vrijgevigheid is bewonderenswaardig.",
  "Een ware gentleman in hart en nieren.",
  "Nobel van je.",
  "Een toonbeeld van generositeit.",
  "Uitmuntend en hoffelijk.",
  "Een klasse-act, zoals altijd.",
  "Je eert de goede naam van een gentleman.",
  "Een gebaar van grote klasse.",

  # Club-specifiek (magast)
  "Je doet de naam 'magast' eer aan.",
  "Zo zijn we bij magast. Klasse!",
  "Dit is de magast-spirit op zijn best.",
  "Een ware magast-gentleman.",
  "Je versterkt de banden binnen magast.",
  "Magast is trots op leden zoals jij.",
  "Dit is hoe je het goede voorbeeld geeft.",
  "De magast-gemeenschap waardeert dit enorm.",
  "Je bouwt mee aan de toekomst van magast.",
  "Magast draait op vrijgevigheid zoals die van jou.",

  # Modern & Informeel
  "Topactie!",
  "Goed bezig!",
  "Legend.",
  "Respect!",
  "Sterk staaltje.",
  "Zo zien we het graag.",
  "Klasse!",
  "Pure klasse.",
  "Chapeau!",
  "Je bent een topper.",

  # Actie- & Impactgericht
  "Bedankt voor het delen.",
  "Je gift wordt zeer gewaardeerd.",
  "Je hebt zojuist iemands dag een stuk beter gemaakt.",
  "Een prachtige bijdrage.",
  "Delen is vermenigvuldigen.",
  "Een mooi voorbeeld van 'pay it forward'.",
  "Je investeert in een ander, mooi om te zien.",
  "Je support is van onschatbare waarde.",
  "Je brengt de boel in beweging.",
  "Een impuls die telt.",
  "Rijkdom is meer dan bezit, het is vrijgevigheid.",

  # Humoristisch & Speels
  "Aandelen gooien als confetti!",
  "Je bent de Sinterklaas van de aandelen.",
  "Big spender!",
  "*Strooit met aandelen als een baas.*",
  "Kijk aan, de filantroop is in the house.",
  "Je aandelenportefeuille is nu officieel cooler.",
  "Je aandelenkarma is prachtig.",
  "Dagobert Duck zou jaloers zijn op deze actie.",
]

    # Kies willekeurig één zin uit de lijst
    random_phrase = gentleman_phrases.sample
    # --- EINDE AANPASSING ---
    
    sender_pm_topic = find_or_create_shares_pm(current_user)
    
    # Gebruik de willekeurige zin in het bericht
    sender_log_entry = "Je hebt **#{amount} aandelen** verzonden naar #{receiver.username}. #{random_phrase}\n\n"
    sender_log_entry += "*Omschrijving: #{description}*" if description.present?
    
    sender_pm_topic.add_moderator_post(
      Discourse.system_user,
      sender_log_entry,
      bump: false,
      post_type: Post.types[:small_action],
      action_code: "aandelen.sent"
    )
      # --- EINDE BERICHTEN LOGICA ---
    end

    render json: { success: true }
  rescue => e
    Rails.logger.error("[AANDELEN] transfer failed: #{e.class}: #{e.message}\n#{e.backtrace.join("\n")}")
    render json: { success: false, errors: [e.message] }
  end

  def users
    users = User.where(active: true).limit(50).map do |u|
      { id: u.id, username: u.username, name: u.name }
    end
    render json: { users: users }
  end

  def transactions
    require_dependency "#{Rails.root}/plugins/aandelen-discourse/app/models/aandelen_transaction"
    txs = AandelenTransaction
            .where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id)
            .order(created_at: :desc)
            .limit(50)
    render json: {
      aandelen: txs.map { |tx|
        base = if tx.sender_id == current_user.id
          { type: "sent", amount: tx.amount, date: tx.created_at.strftime("%d-%m-%Y %H:%M"), user: tx.receiver.username }
        else
          { type: "received", amount: tx.amount, date: tx.created_at.strftime("%d-%m-%Y %H:%M"), user: "een gentleman" }
        end
        base[:description] = tx.description if tx.description.present?
        base
      }
    }
  end

  private

  def find_or_create_shares_pm(user)
    # Deze helper methode werkt voor zowel zender als ontvanger.
    pm = TopicCustomField
           .where(name: "is_aandelen_log", value: "t")
           .joins(topic: :topic_users)
           .where(topics: { archetype: 'private_message', user_id: Discourse.system_user.id })
           .where(topic_users: { user_id: user.id })
           .first
           &.topic

    return pm if pm

    post = PostCreator.create!(
      Discourse.system_user,
      archetype: Archetype.private_message,
      title: "Jouw Aandelen Transactieoverzicht",
      raw: "Dit is een overzicht van de aandelen die je ontvangt of verstuurt.",
      target_usernames: user.username,
      validate: false
    )
    
    post.topic.custom_fields["is_aandelen_log"] = "t"
    post.topic.save!

    post.topic
  end
end