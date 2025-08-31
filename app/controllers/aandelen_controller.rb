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
    # Zorg dat het model geladen wordt
    require_dependency "#{Rails.root}/plugins/aandelen-discourse/app/models/aandelen_transaction"

    receiver = User.find_by(username: params[:username])
    amount = params[:amount].to_i

    if receiver.nil?
      return render json: { success: false, errors: ["Gebruiker niet gevonden"] }
    end

    if current_user.aandelen_balance < amount
      return render json: { success: false, errors: ["Niet genoeg aandelen"] }
    end

    ActiveRecord::Base.transaction do
      current_user.update!(aandelen_balance: current_user.aandelen_balance - amount)
      receiver.update!(aandelen_balance: receiver.aandelen_balance + amount)

      # Gebruik associations van het model
      AandelenTransaction.create!(
        sender: current_user,
        receiver: receiver,
        amount: amount
      )
    end

    render json: { success: true }
  rescue => e
    render json: { success: false, errors: [e.message] }
  end

  # Optioneel: lijst van transacties voor de huidige gebruiker
  def transactions
    require_dependency "#{Rails.root}/plugins/aandelen-discourse/app/models/aandelen_transaction"

    txs = AandelenTransaction
            .where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id)
            .order(created_at: :desc)
            .limit(50)

    render json: {
      aandelen: txs.map { |tx|
        if tx.sender_id == current_user.id
          {
            type: "sent",
            amount: tx.amount,
            date: tx.created_at.strftime("%d-%m-%Y %H:%M"),
            user: tx.receiver.username
          }
        else
          {
            type: "received",
            amount: tx.amount,
            date: tx.created_at.strftime("%d-%m-%Y %H:%M"),
            user: "een gentleman"
          }
        end
      }
    }
  end
end
