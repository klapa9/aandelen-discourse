# app/controllers/shares_controller.rb

class ::SharesController < ::ApplicationController
  requires_plugin ::AandelenDiscourse
  before_action :ensure_logged_in

  def index
    user = User.find_by_username!(params[:username])

    # Voorbeeld: haal de aandelen van de gebruiker op
    # user_shares = UserShare.where(user_id: user.id)

    # Gebruik een Serializer voor de 'nette' manier,
    # maar voor nu is een simpele JSON-dump voldoende.
    render json: {
      message: "Data voor #{user.username}",
      shares: [
        { name: "Aandeel A", amount: 10 },
        { name: "Aandeel B", amount: 5 }
      ]
    }
  end

  # ... je andere 'show' en 'send_shares' acties blijven zoals ze zijn
end