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

    # De transactie zelf gebeurt nog steeds direct en snel
    ActiveRecord::Base.transaction do
      current_user.update!(aandelen_balance: current_user.aandelen_balance - amount)
      receiver.update!(aandelen_balance: receiver.aandelen_balance + amount)

      AandelenTransaction.create!(
        sender: current_user,
        receiver: receiver,
        amount: amount,
        description: description
      )
    end

    # Zet het versturen van de berichten in de wachtrij voor de achtergrond
    Jobs.enqueue(
      :send_aandelen_messages,
      sender_id: current_user.id,
      receiver_id: receiver.id,
      amount: amount,
      description: description
    )

    # De controller geeft nu onmiddellijk de bevestiging terug aan de browser
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

  # De find_or_create_shares_pm is nu verplaatst naar de background job,
  # dus deze kan hier weg om de controller schoon te houden.
  # Als je hem op andere plekken gebruikt, kun je hem laten staan.
end