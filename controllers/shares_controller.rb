# app/controllers/shares_controller.rb

# frozen_string_literal: true

class SharesController < ::ApplicationController
  # Deze regel zorgt ervoor dat alleen ingelogde gebruikers dit kunnen zien
  before_action :ensure_logged_in

  def show
    # Vind de gebruiker op basis van de username in de URL (bv. .../aandelen/klapa.json)
    user = User.find_by(username_lower: params[:username].downcase)

    # Als de gebruiker niet bestaat, geef een 404 fout (Not Found) terug
    return render_404 unless user

    # --- DUMMY DATA ---
    # Later haal je hier de echte aandelentransacties uit de database.
    # Voor nu simuleren we de data zodat je frontend iets heeft om te tonen.
    dummy_transactions = [
      { date: '2025-08-12T10:00:00Z', description: "Ontvangen van de server", amount: 50, isPositive: true },
      { date: '2025-08-10T14:30:00Z', description: "Gegeven aan de server", amount: 10, isPositive: false },
      { date: '2025-08-01T09:00:00Z', description: "Startkapitaal van server", amount: 100, isPositive: true }
    ]

    # Stuur de data terug als een JSON-object.
    # Je frontend ontvangt dit en kan de 'share_transactions' gebruiken.
    render json: {
      share_transactions: dummy_transactions
    }
  end
end
