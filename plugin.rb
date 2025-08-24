# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

load File.expand_path('./controllers/aandelen_controller.rb', __FILE__)
load File.expand_path('./serializers/aandelen_serializer.rb', __FILE__)

Discourse::Application.routes.append do
  # Registreert de GET request voor de aandelen pagina en linkt het aan onze controller action
  get "/u/:username/aandelen" => "aandelen#show"
end