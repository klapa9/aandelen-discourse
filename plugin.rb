# frozen_string_literal: true

# name: aandelen-discourse
# about: A plugin to manage user shares and transactions
# version: 1.0.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :shares_enabled

# Define a module constant so `requires_plugin` can check it
module ::AandelenDiscourse
  PLUGIN_NAME = "aandelen-discourse"
end

after_initialize do
  Rails.logger.warn "[aandelen-discourse] after_initialize start"

  require_dependency "application_controller"

  require_relative "app/controllers/shares_controller"

  # ---- IMPORTANT: PREPEND so we beat the built-in /u/:username/:section route
  
  Discourse::Application.routes.prepend do
    constraints(username: RouteFormat.username) do
      get "u/:username/shares" => "shares#index", defaults: { format: :json }
      get "users/:username/shares" => "shares#index"
    end

    scope "/shares" do
      get  "/user/:username"      => "shares#show",        constraints: { username: RouteFormat.username }
      post "/user/:username/send" => "shares#send_shares", constraints: { username: RouteFormat.username }
    end
  end

  Rails.logger.warn "[aandelen-discourse] routes registered"
end
