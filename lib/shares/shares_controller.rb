# frozen_string_literal: true

module ::Shares
  class SharesController < ::ApplicationController
    requires_login

    # POST /shares/transfer
    def transfer
      target = User.find_by(id: params[:target_id])
      amount = params[:amount].to_i

      unless target
        render_json_error("Gebruiker niet gevonden") and return
      end

      if amount <= 0
        render_json_error("Het aantal moet positief zijn") and return
      end

      sender_shares = current_user.custom_fields["shares"].to_i
      if sender_shares < amount
        render_json_error("Je hebt niet genoeg aandelen") and return
      end

      # Verminder aandelen van de huidige gebruiker
      current_user.custom_fields["shares"] = sender_shares - amount
      current_user.save_custom_fields

      # Verhoog aandelen van de target gebruiker
      target.custom_fields["shares"] = target.custom_fields["shares"].to_i + amount
      target.save_custom_fields

      render json: { success: true, sender_shares: current_user.custom_fields["shares"], target_shares: target.custom_fields["shares"] }
    rescue StandardError => e
      render_json_error("Er is een fout opgetreden: #{e.message}")
    end
  end
end
