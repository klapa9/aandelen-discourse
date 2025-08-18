# frozen_string_literal: true

class UserShareSerializer < ApplicationSerializer
 attributes :balance, :user_id
 
 def user_id
   object.user.id
 end
end