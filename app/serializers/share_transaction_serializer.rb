# frozen_string_literal: true

class ShareTransactionSerializer < ApplicationSerializer
 attributes :id, :amount, :created_at, :sender_username, :receiver_username, :type_for_user
 
 def sender_username
   object.sender.username
 end
 
 def receiver_username
   object.receiver.username
 end
 
 def type_for_user
   if scope && object.sender_id == scope.id
     'sent'
   else
     'received'
   end
 end
end