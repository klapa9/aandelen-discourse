# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  def index
    begin
      # We proberen de "bulletproof" code uit te voeren die toch crasht.
      render json: success_json({
        owner_username: params[:username],
        shares: [
          { stock_name: "Test Aandeel", quantity: 123 }
        ]
      })
    rescue StandardError => e
      # VANG DE CRASH!
      # In plaats van een generieke 500-error, sturen we nu een JSON terug
      # met de precieze details van de fout.
      render json: {
        error: "Een crash is opgevangen in de SharesController",
        error_class: e.class.to_s,
        error_message: e.message,
        backtrace: e.backtrace.take(15) # De eerste 15 regels van de stack trace
      }, status: 500
    end
  end
end