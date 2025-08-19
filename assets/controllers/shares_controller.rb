# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  requires_plugin 'aandelen-discourse'

  # publiek zichtbare profiel-pagina → geen login verplicht
  before_action :load_user, only: [:index, :show]
  before_action :ensure_logged_in, only: [:send_shares]

  def index
    # server-rendered HTML pagina (gebruik de view app/views/shares/index.html.erb)
    @balance = (@user.user_share&.balance || 0)
    @transactions = ShareTransaction.where(user_id: @user.id).order(created_at: :desc).limit(20)
    render template: "shares/index"
  end

  # JSON endpoint voor ajax (ajax haalt data via /shares/user/:username)
  def show
    user_share = @user.user_share || @user.create_user_share!(balance: 100)
    transactions = ShareTransaction.where(user_id: @user.id).order(created_at: :desc).limit(50)

    render_json_dump(
      username: @user.username,
      balance: user_share.balance,
      transactions: transactions.map { |t|
        {
          id: t.id,
          amount: t.amount,
          transaction_type: t.transaction_type,
          created_at: t.created_at
        }
      },
      can_send: !!current_user
    )
  end

  # Simpele POST endpoint om aandelen te 'versturen'
  # Verwacht params: target_username, amount
  def send_shares
    amount = params[:amount].to_i
    target_username = params[:target_username] || params[:target]
    target = User.find_by_username(target_username)

    if amount <= 0 || target.nil?
      render_json_error("Invalid parameters")
      return
    end

    sender = current_user
    sender.ensure_user_share
    target.ensure_user_share

    if sender.shares_balance < amount
      render_json_error("Insufficient balance")
      return
    end

    ActiveRecord::Base.transaction do
      sender.user_share.update!(balance: sender.shares_balance - amount)
      target.user_share.update!(balance: target.shares_balance + amount)

      ShareTransaction.create!(user_id: sender.id, amount: -amount, transaction_type: "send", target_user_id: target.id)
      ShareTransaction.create!(user_id: target.id, amount: amount, transaction_type: "receive", target_user_id: sender.id)
    end

    render_json_dump(success: true, new_balance: sender.shares_balance)
  end

  private

  def load_user
    @user = User.find_by_username(params[:username])
    raise Discourse::NotFound unless @user
  end
end
