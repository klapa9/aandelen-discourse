# frozen_string_literal: true

class UserShare < ActiveRecord::Base
 belongs_to :user
 
 validates :balance, presence: true, numericality: { greater_than_or_equal_to: 0 }
 validates :user_id, presence: true, uniqueness: true
 
 def self.transfer_shares(sender, receiver, amount)
   return { success: false, error: "Cannot send to yourself" } if sender.id == receiver.id
   return { success: false, error: "Invalid amount" } if amount <= 0
   
   transaction do
     sender_share = sender.ensure_user_share
     receiver_share = receiver.ensure_user_share
     
     if sender_share.balance < amount
       return { success: false, error: "Insufficient balance" }
     end
     
     sender_share.update!(balance: sender_share.balance - amount)
     receiver_share.update!(balance: receiver_share.balance + amount)
     
     ShareTransaction.create!(
       sender: sender,
       receiver: receiver,
       amount: amount
     )
     
     { success: true }
   end
 rescue => e
   { success: false, error: e.message }
 end
end

# Table name: user_shares
#
#  id         :bigint           not null, primary key
#  user_id    :integer          not null
#  balance    :decimal(15, 2)   default(0.0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null