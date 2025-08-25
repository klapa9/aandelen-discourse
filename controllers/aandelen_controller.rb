module AandelenDiscourse
  class AandelenController < ::ApplicationController
    # Zorg ervoor dat ingelogde gebruikers deze route kunnen bereiken
    skip_before_action :check_xhr, only: [:balance]

    def balance
      render json: { success: true, message: "De dummy-controller werkt!" }
    end
  end
end