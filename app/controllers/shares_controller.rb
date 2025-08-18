# frozen_string_literal: true

class SharesController < ApplicationController
 before_action :ensure_logged_in
 before_action :find_user, only: [:show, :send_shares]
 
 def show
   user_share = @user.ensure_user_share
   transactions = ShareTransaction.for_user(@user).recent.limit(50).includes(:sender, :receiver)
   
   render json: {
     user: {
       id: @user.id,
       username: @user.username,
       avatar_template: @user.avatar_template
     },
     balance: user_share.balance.to_f,
     transactions: transactions.map do |t|
       {
         id: t.id,
         amount: t.amount.to_f,
         sender_username: t.sender.username,
         receiver_username: t.receiver.username,
         created_at: t.created_at,
         type_for_user: t.sender_id == @user.id ? 'sent' : 'received'
       }
     end,
     can_send: @user.id != current_user.id
   }
 end
 
 def send_shares
   if @user.id == current_user.id
     return render json: { success: false, error: "Cannot send shares to yourself" }, status: 400
   end
   
   amount = params[:amount].to_f
   
   if amount <= 0
     return render json: { success: false, error: "Invalid amount" }, status: 400
   end
   
   result = UserShare.transfer_shares(current_user, @user, amount)
   
   if result[:success]
     render json: { success: true, message: "Shares sent successfully!" }
   else
     render json: { success: false, error: result[:error] }, status: 400
   end
 end
 
 private
 
 def find_user
   @user = User.find_by(username_lower: params[:username].downcase)
   raise Discourse::NotFound unless @user
 end
end