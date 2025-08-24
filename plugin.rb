# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

after_initialize do
  # Gebruik __dir__ voor een robuuster pad. Dit verwijst naar de map waarin plugin.rb staat.
  load File.expand_path("controllers/aandelen_controller.rb", __dir__)
  load File.expand_path("serializers/aandelen_serializer.rb", __dir__)

  # Voeg de route toe binnen de Discourse-applicatie context
  Discourse::Application.routes.append do
    get "/u/:username/aandelen" => "aandelen#show"
  end
end