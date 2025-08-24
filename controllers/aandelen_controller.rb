class AandelenController < ApplicationController
  before_action :ensure_logged_in

  def show
    user = User.find_by_username(params[:username])
    raise Discourse::NotFound if user.nil?

    # Voorbeeld data
    aandelen_data = { id: user.id, aantal_aandelen: 123 }

    # Maak een simpel object van de hash, dit werkt beter met de serializer
    aandelen_object = OpenStruct.new(aandelen_data)

    # Gebruik de 'render_serialized' helper met een expliciete 'root' key
    render_serialized(aandelen_object, AandelenSerializer, root: "aandelen")
  end
end