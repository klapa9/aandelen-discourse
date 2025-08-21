# name: aandelen-discourse
# about: A plugin to manage user shares and transactions
# version: 1.0.0
# authors: klapa9

enabled_site_setting :shares_enabled

after_initialize do
  require_relative "app/controllers/shares_controller.rb"

  Discourse::Application.routes.prepend do
    get "u/:username/shares" => "shares#index", constraints: { username: RouteFormat.username }, defaults: { format: :json }
  end
end