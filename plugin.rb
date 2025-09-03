# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse
require_relative "app/services/aandelen/automatische_transactie"
require_relative "app/models/aandelen_transaction"
register_asset "stylesheets/aandelen-tab.scss"

after_initialize do
  load File.expand_path("../app/controllers/aandelen_controller.rb", __FILE__)
  load File.expand_path("../app/controllers/invites_controller.rb", __FILE__)

  Discourse::Application.routes.append do
    get "/aandelen/balance" => "aandelen#balance", defaults: { format: :json }
    get "/aandelen/transactions" => "aandelen#transactions", defaults: { format: :json }
    get "/aandelen/invites" => "invites#index", defaults: { format: :json }
    get "/aandelen/users" => "aandelen#users", defaults: { format: :json }
    post "/aandelen/transfer" => "aandelen#transfer", defaults: { format: :json }
  end

  # automatische transactie bij aanmaken nieuwe gebruiker
  on(:user_created) do |new_user|
    Aandelen::AutomatischeTransactie.execute(new_user)
  end

  # Validatie voor invites toevoegen
  require_dependency "invite"
  require_relative "app/validators/aandelen_invite_validator"

  Invite.class_eval do
    validate do
      AandelenInviteValidator.validate(self)
    end
  end

end