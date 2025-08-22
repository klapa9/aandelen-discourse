# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

# Er is hier GEEN register_asset voor de .hbs-template meer nodig.
# Discourse laadt dit automatisch.

after_initialize do
  # Zorg ervoor dat de 'component' naam overeenkomt met het pad en de naam van de template.
  add_user_card_tab(:aandelen_tab, component: "user/shares", title: "Aandelen", icon: "chart-line")
end