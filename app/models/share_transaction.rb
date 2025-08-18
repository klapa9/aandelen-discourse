# frozen_string_literal: true

class ShareTransaction < ActiveRecord::Base
 belongs_to :sender, class_name: 'User'
 belongs_to :receiver, class_name: 'User'
 
 validates :amount, presence: true, numericality: { greater_than: 0 }
 
 scope :for_user, ->(user) { where('sender_id = ? OR receiver_id = ?', user.id, user.id) }
 scope :recent, -> { order(created_at: :desc) }
end