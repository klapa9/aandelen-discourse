# frozen_string_literal: true


# name: aandelen-discourse
# about: A plugin to manage user shares and transactions
# version: 1.0.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :shares_enabled

after_initialize do
  Rails.logger.warn("👉 [aandelen-discourse] plugin.rb after_initialize loaded")
  # Zorg dat basis afhankelijkheden geladen zijn
  require_dependency "application_controller"

  # (Expliciet) laden van je pluginbestanden
  require_relative "app/models/user_share"
  require_relative "app/models/share_transaction"

  require_relative "app/serializers/user_share_serializer"
  require_relative "app/serializers/share_transaction_serializer"

  require_relative "app/controllers/shares_controller"

  # ===== Rails routes =====
  Discourse::Application.routes.append do
    # Route die HTML serveert zodat Ember kan bootstrappen op /u/:username/shares
    constraints(username: RouteFormat.username) do
      get "u/:username/shares" => "shares#index"
      # optioneel alias
      get "users/:username/shares" => "shares#index"
    end

    # JSON API endpoints voor je controller
    scope "/shares" do
      get  "/user/:username"       => "shares#show",         constraints: { username: RouteFormat.username }
      post "/user/:username/send"  => "shares#send_shares",  constraints: { username: RouteFormat.username }
    end
  end

  # ===== User-model uitbreiden =====
  ::User.class_eval do
    has_one :user_share, dependent: :destroy

    def shares_balance
      user_share&.balance.to_i
    end

    def ensure_user_share
      user_share || create_user_share!(balance: 100)
    end
  end

  # ===== Seed: starttegoed voor nieuwe users =====
  on(:user_created) do |user|
    user.create_user_share!(balance: 100) unless user.user_share
  end
end
