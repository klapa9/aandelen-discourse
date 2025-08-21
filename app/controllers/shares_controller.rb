# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  def index
    # Deze code KAN NIET crashen. Het doet niets anders dan JSON terugsturen.
    render json: success_json({
      owner_username: params[:username],
      shares: [
        { stock_name: "Test Aandeel", quantity: 123 },
        { stock_name: "Succes Inc.", quantity: 456 }
      ]
    })
  end
end