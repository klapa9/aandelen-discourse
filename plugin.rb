# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

after_initialize do
  load File.expand_path("controllers/aandelen_controller.rb", __dir__)

  Discourse::Application.routes.append do
    get "/u/:username/aandelen" => "aandelen#show"
  end
end