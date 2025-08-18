# frozen_string_literal: true

class SharesController < ApplicationController
 before_action :ensure_logged_in
 before_action :find_user, only: [:show, :send_shares]
 
 def show
   user_share = @user.user_share || @user.create_user_share(balance: 0)
   transactions = ShareTransaction.for_user(@user).recent.limit(20).includes(:sender, :receiver)
   
   render json: {
     user: BasicUserSerializer.new(@user, root: false),
     balance: user_share.balance,
     transactions: ActiveModel::ArraySerializer.new(
       transactions,
       each_serializer: ShareTransactionSerializer,
       scope: current_user
     ),
     can_send: @user != current_user
   }
 end
 
 def send_shares
   return render_json_error(I18n.t('shares.cannot_send_to_self')) if @user == current_user
   
   amount = params[:amount].to_f
   return render_json_error(I18n.t('shares.invalid_amount')) if amount <= 0
   
   current_user.initialize_shares unless current_user.user_share
   
   if UserShare.transfer(current_user, @user, amount)
     render json: { success: true, message: I18n.t('shares.shares_sent_successfully') }
   else
     render_json_error(I18n.t('shares.insufficient_balance'))
   end
 end
 
 private
 
 def find_user
   @user = User.find_by(username_lower: params[:username].downcase)
   raise Discourse::NotFound unless @user
 end
end