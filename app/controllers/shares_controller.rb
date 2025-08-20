# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  # Fail fast als de plugin uit staat
  requires_plugin ::AandelenDiscourse

  def index
    # Vind de gebruiker op basis van de username in de URL
    user = User.find_by_username!(params[:username])

    # Voorbeeld data. Je kunt hier later echte data uit je database halen.
    example_shares_data = [
      { stock_name: "Discourse Inc.", quantity: 100 },
      { stock_name: "Community LLC", quantity: 50 }
    ]

    # Geef de data terug als JSON.
    # De 'success_json' helper is een standaard Discourse manier om dit te doen.
    render json: success_json({
      shares: example_shares_data,
      owner_username: user.username
    })
  end
end