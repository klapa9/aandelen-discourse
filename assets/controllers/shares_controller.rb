# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  # Fail fast if plugin is disabled/missing
  requires_plugin ::AandelenDiscourse

  # Allow a normal HTML GET (not just XHR) so we can eyeball it
  skip_before_action :check_xhr, only: [:index]

  def index
    username = params[:username]
    Rails.logger.warn "[aandelen-discourse] SharesController#index for #{username}"

    # Minimal HTML so you immediately see it's working
    html = <<~HTML
      <div style="padding:2rem;font:16px/1.45 system-ui,-apple-system,Segoe UI,Roboto">
        <h1 style="margin:0 0 0.5rem;">Shares page OK</h1>
        <p>for <strong>#{ERB::Util.html_escape(username)}</strong></p>
        <p>(This is a smoke-test coming from <code>SharesController#index</code>.)</p>
      </div>
    HTML

    render html: html.html_safe
  end

  def show
    user = User.find_by_username!(params[:username])
    render_json_dump(
      balance: (user.user_share&.balance || 100),
      transactions: [],
      can_send: current_user&.admin? || current_user&.id == user.id
    )
  end

  def send_shares
    render_json_error("Not implemented"), status: 501
  end
end
