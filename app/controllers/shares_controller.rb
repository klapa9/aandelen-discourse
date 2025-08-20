# frozen_string_literal: true

class ::SharesController < ::ApplicationController
  requires_plugin ::AandelenDiscourse

  def index
    # Gebruik de standaard Discourse helper om een gebruiker te vinden.
    # Dit is veiliger en lost het 404-probleem op.
    user = find_user_from_params
    guardian.ensure_can_see_user_profile!(user) # Zeker weten dat we het profiel mogen zien

    example_shares_data = [
      { stock_name: "Discourse Inc.", quantity: 100 },
      { stock_name: "Community LLC", quantity: 50 },
    ]

    render json: success_json({
      shares: example_shares_data,
      owner_username: user.username,
    })
  end
end