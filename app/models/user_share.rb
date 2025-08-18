# frozen_string_literal: true

class UserShare < ActiveRecord::Base
 belongs_to :user
 
 validates :balance, presence: true, numericality: { greater_than_or_equal_to: 0 }
 
 def self.transfer(sender, receiver, amount)
   return false if sender == receiver
   return false if amount <= 0
   
   ActiveRecord::Base.transaction do
     sender_share = sender.user_share || sender.create_user_share(balance: 0)
     receiver_share = receiver.user_share || receiver.create_user_share(balance: 0)
     
     return false if sender_share.balance < amount
     
     sender_share.update!(balance: sender_share.balance - amount)
     receiver_share.update!(balance: receiver_share.balance + amount)
     
     ShareTransaction.create!(
       sender: sender,
       receiver: receiver,
       amount: amount
     )
     
     true
   end
 rescue ActiveRecord::RecordInvalid
   false
 end
end