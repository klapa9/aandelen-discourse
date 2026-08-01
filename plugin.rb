# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

require "json"
require_relative "app/services/aandelen/automatische_transactie"
require_relative "app/models/aandelen_transaction"
register_asset "stylesheets/aandelen-tab.scss"

AANDELEN_RECEIVED_NOTIFICATION_TYPE = 999

module Aandelen
  module PluginHooks
    def self.registered?
      @registered ||= false
    end

    def self.register!
      return if registered?

      @registered = true

      Notification.types[:aandelen_received] = AANDELEN_RECEIVED_NOTIFICATION_TYPE

      Discourse::Application.routes.append do
        get "/aandelen/balance" => "aandelen#balance", defaults: { format: :json }
        get "/aandelen/transactions" => "aandelen#transactions", defaults: { format: :json }
        get "/aandelen/invites" => "aandelen_invites#index", defaults: { format: :json }
        get "/aandelen/users" => "aandelen#users", defaults: { format: :json }
        post "/aandelen/transfer" => "aandelen#transfer", defaults: { format: :json }
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
  end
end

after_initialize do
  begin
    require_dependency "#{Rails.root}/plugins/aandelen-discourse/app/jobs/regular/send_aandelen_messages.rb"
    load File.expand_path("../app/controllers/aandelen_controller.rb", __FILE__)
    load File.expand_path("../app/controllers/aandelen_invites_controller.rb", __FILE__)

    # Vertel de serializer om de 'data' attribute correct te verwerken.
    # Discourse kan deze waarde na een update als string, hash of nil leveren.
    add_to_serializer(:notification, :data) do
      raw_data = object.data

      if raw_data.blank?
        {}
      elsif raw_data.is_a?(Hash)
        raw_data
      else
        begin
          JSON.parse(raw_data)
        rescue JSON::ParserError, TypeError
          {}
        end
      end
    end

    # automatische transactie bij aanmaken nieuwe gebruiker
    on(:user_created) do |new_user|
      Aandelen::AutomatischeTransactie.execute(new_user)
    end

    Aandelen::PluginHooks.register!
  rescue => e
    Rails.logger.error("[AANDELEN] Plugin initialization failed: #{e.class}: #{e.message}\n#{e.backtrace.join("\n")}")
  end
end
