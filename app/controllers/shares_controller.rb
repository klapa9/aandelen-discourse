# frozen_string_literal: true

class SharesController < ::ApplicationController
  requires_plugin 'aandelen-discourse'

  before_action :ensure_logged_in

  # 🔹 Voor de profiel-tab /u/:username/shares
  def index
    user = fetch_user_from_params
    ensure_user_share(user)

    render_json_dump({
      user: user.username,
      balance: user.shares_balance,
      transactions: user.share_transactions.order(created_at: :desc).limit(20).map do |t|
        {
          id: t.id,
          amount: t.amount,
          transaction_type: t.transaction_type,
          created_at: t.created_at
        }
      end
    })
  end

  # 🔹 Voor API-call /shares/user/:username
  def show
    user = fetch_user_from_params
    ensure_user_share(user)

    render_json_dump(UserShareSerializer.new(user.user_share, root: false))
  end

  # 🔹 Voor API-call /shares/user/:username/send
  def send_shares
    target = User.find_by_username(params[:target_username])
    raise Discourse::InvalidParameters.new(:target_username) unless target

    sender = current_user
    amount = params[:amount].to_i

    if sender.shares_balance < amount
      render_json_error("Insufficient balance")
      return
    end

    ActiveRecord::Base.transaction do
      sender.ensure_user_share.update!(balance: sender.shares_balance - amount)
      target.ensure_user_share.update!(balance: target.shares_balance + amount)

      sender.share_transactions.create!(amount: -amount, transaction_type: 'send', target_user: target)
      target.share_transactions.create!(amount: amount, transaction_type: 'receive', target_user: sender)
    end

    render_json_dump(success: true, new_balance: sender.shares_balance)
  end

  private

  def fetch_user_from_params
    User.find_by_username(params[:username])
  end

  def ensure_user_share(user)
    user.ensure_user_share
  end
end
