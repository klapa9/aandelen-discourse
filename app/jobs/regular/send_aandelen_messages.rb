# frozen_string_literal: true

module Jobs
  class SendAandelenMessages < ::Jobs::Base
    def execute(args)
      sender_id = args[:sender_id]
      receiver_id = args[:receiver_id]
      amount = args[:amount]
      description = args[:description].presence || ""

      return unless sender_id && receiver_id && amount

      sender = User.find_by(id: sender_id)
      receiver = User.find_by(id: receiver_id)

      return unless sender && receiver

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

      # 2. Bericht voor de VERZENDER (met details en een willekeurige zin)
      gentleman_phrases = [
        # Klassiek & Formeel
        "Heel Gentleman van je!", "Wat een gulle daad.", "Je vrijgevigheid is bewonderenswaardig.",
        "Een ware gentleman in hart en nieren.", "Nobel van je.", "Een toonbeeld van generositeit.",
        "Uitmuntend en hoffelijk.", "Een klasse-act, zoals altijd.", "Je eert de goede naam van een gentleman.",
        "Een gebaar van grote klasse.",

        # Club-specifiek (magast)
        "Je doet de naam 'magast' eer aan.", "Zo zijn we bij magast. Klasse!", "Dit is de magast-spirit op zijn best.",
        "Een ware magast-gentleman.", "Je versterkt de banden binnen magast.", "Magast is trots op leden zoals jij.",
        "Dit is hoe je het goede voorbeeld geeft.", "De magast-gemeenschap waardeert dit enorm.",
        "Je bouwt mee aan de toekomst van magast.", "Magast draait op vrijgevigheid zoals die van jou.",

        # Modern & Informeel
        "Topactie!", "Goed bezig!", "Legend.", "Respect!", "Sterk staaltje.", "Zo zien we het graag.",
        "Klasse!", "Pure klasse.", "Chapeau!", "Je bent een topper.",

        # Actie- & Impactgericht
        "Bedankt voor het delen.", "Je gift wordt zeer gewaardeerd.", "Je hebt zojuist iemands dag een stuk beter gemaakt.",
        "Een prachtige bijdrage.", "Delen is vermenigvuldigen.", "Een mooi voorbeeld van 'pay it forward'.",
        "Je investeert in een ander, mooi om te zien.", "Je support is van onschatbare waarde.",
        "Je brengt de boel in beweging.", "Een impuls die telt.", "Rijkdom is meer dan bezit, het is vrijgevigheid.",

        # Humoristisch & Speels
        "Aandelen gooien als confetti!", "Je bent de Sinterklaas van de aandelen.", "Big spender!",
        "*Strooit met aandelen als een baas.*", "Kijk aan, de filantroop is in the house.",
        "Je aandelenportefeuille is nu officieel cooler.", "Je aandelenkarma is prachtig.",
        "Dagobert Duck zou jaloers zijn op deze actie.",
      ]
      random_phrase = gentleman_phrases.sample
      
      sender_pm_topic = find_or_create_shares_pm(sender)
      
      sender_log_entry = "Je hebt **#{amount} aandelen** verzonden naar #{receiver.username}. #{random_phrase}\n\n"
      sender_log_entry += "*Omschrijving: #{description}*" if description.present?
      
      sender_pm_topic.add_moderator_post(
        Discourse.system_user,
        sender_log_entry,
        bump: false,
        post_type: Post.types[:small_action],
        action_code: "aandelen.sent"
      )
    end

    private

    def find_or_create_shares_pm(user)
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
        raw: "Dit is een automatisch overzicht van de aandelen die je ontvangt of verstuurt.",
        target_usernames: user.username,
        validate: false
      )
      
      post.topic.custom_fields["is_aandelen_log"] = "t"
      post.topic.save!
      post.topic
    end
  end
end