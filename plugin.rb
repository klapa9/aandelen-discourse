# frozen_string_literal: true

# name: aandelen-plugin
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: Jouw Naam
# url: https://github.com/klapa9/aandelen-discourse

register_asset "stylesheets/aandelen.scss"
register_asset "javascripts/discourse/templates/mobile/aandelen.hbs"

after_initialize do
  add_user_card_tab(:aandelen_tab, component: "aandelen", title: "Aandelen", icon: "chart-line")
end