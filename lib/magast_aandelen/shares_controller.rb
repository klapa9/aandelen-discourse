module ::Shares
  class SharesController < ::ApplicationController
    requires_login

    def transfer
      target = User.find(params[:target_id])
      amount = params[:amount].to_i

      if amount <= 0
        render_json_error "Amount must be positive" and return
      end

      sender_shares = current_user.custom_fields["shares"].to_i

      if sender_shares < amount
        render_json_error "Not enough shares" and return
      end

      current_user.custom_fields["shares"] = sender_shares - amount
      current_user.save_custom_fields

      target.custom_fields["shares"] = target.custom_fields["shares"].to_i + amount
      target.save_custom_fields

      render json: { success: true }
    end
  end
end
