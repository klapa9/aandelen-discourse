# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

after_initialize do
  load File.expand_path("../app/controllers/aandelen_controller.rb", __FILE__)

  Discourse::Application.routes.append do
    get "/aandelen/balance" => "aandelen#balance", defaults: { format: :json }
    get "/aandelen/transactions" => "aandelen#transactions", defaults: { format: :json }
    post "/aandelen/transfer" => "aandelen#transfer", defaults: { format: :json }
  end


end