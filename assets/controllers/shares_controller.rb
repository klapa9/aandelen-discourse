# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  def index
    # We doen GEEN database lookups of guardian checks.
    # We sturen alleen simpele, vaste data terug om te bewijzen dat de controller werkt.
    render json: success_json({
      owner_username: params[:username], # We gebruiken gewoon de parameter uit de URL
      shares: [
        { stock_name: "Test Aandeel", quantity: 123 },
        { stock_name: "Succes Inc.", quantity: 456 }
      ]
    })
  end
end