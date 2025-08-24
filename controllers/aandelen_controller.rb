class AandelenController < ApplicationController
  def show
    user = User.find_by_username(params[:username])
    raise Discourse::NotFound if user.nil?

    # Maak een simpele hash en geef deze direct terug als JSON
    render json: {
      gebruiker: user.username,
      aantal_aandelen: 123,
      bericht: "Dit is een simpele JSON-respons."
    }
  end
end