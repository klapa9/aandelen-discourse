# frozen_string_literal: true

class ShareTransaction < ActiveRecord::Base
 belongs_to :sender, class_name: 'User'
 belongs_to :receiver, class_name: 'User'
 
 validates :amount, presence: true, numericality: { greater_than: 0 }
 validates :sender_id, presence: true
 validates :receiver_id, presence: true
 
 scope :for_user, ->(user) { where('sender_id = ? OR receiver_id = ?', user.id, user.id) }
 scope :recent, -> { order(created_at: :desc) }
 scope :last_30_days, -> { where('created_at > ?', 30.days.ago) }
end

# Table name: share_transactions
#
#  id          :bigint           not null, primary key
#  sender_id   :integer          not null
#  receiver_id :integer          not null
#  amount      :decimal(15, 2)   not null
#  note        :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null