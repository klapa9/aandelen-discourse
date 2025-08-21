# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  def index
    render json: success_json({
      owner_username: params[:username],
      shares: [
        { stock_name: "Test Aandeel", quantity: 123 }
      ]
    })
  end
end