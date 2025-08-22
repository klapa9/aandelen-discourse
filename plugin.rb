# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

# Registreer alleen de client-side template. Gebruik forward slashes.
# Het pad is relatief aan de hoofdmap van je plugin.
register_asset "assets/javascripts/discourse/templates/user/shares.hbs"

after_initialize do
  # Zorg ervoor dat de 'component' naam overeenkomt met het pad en de naam van de template.
  # De map 'user' is onderdeel van het pad, dus we nemen die mee.
  add_user_card_tab(:aandelen_tab, component: "user/shares", title: "Aandelen", icon: "chart-line")
end