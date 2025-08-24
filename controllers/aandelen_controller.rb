class AandelenController < ApplicationController
  # Zorgt ervoor dat deze actie alleen voor ingelogde gebruikers is
  before_action :ensure_logged_in

  def show
    # Vind de gebruiker op basis van de username in de URL
    user = User.find_by_username(params[:username])
    raise Discourse::NotFound if user.nil?

    # Hier zou je de logica plaatsen om het ECHTE aantal aandelen op te halen,
    # bijvoorbeeld uit een custom user field of een andere tabel.
    # Voor nu gebruiken we een vast getal als voorbeeld.
    aandelen_data = { user_id: user.id, aantal_aandelen: 123 } # Voorbeeld data

    # Geef de data terug in JSON formaat, gebruik makend van onze serializer
    render json: AandelenSerializer.new(aandelen_data, root: false)
    #render json: { name: "donut", description: "delicious!" }

  end
end