# frozen_string_literal: true

# Dit is het engine-bestand voor je plugin
module ::AandelenDiscourse
  class Engine < ::Rails::Engine
    engine_name "aandelen_discourse" # Gebruik een unieke naam
    isolate_namespace AandelenDiscourse

    config.before_initialize do
      # Dit is de NIEUWE manier om Ember.js een route te laten negeren
      Discourse::Application.config.ember_cli_opts[:unhandled_paths] ||= []
      Discourse::Application.config.ember_cli_opts[:unhandled_paths] << "/u/%{username}/shares"
    end
  end
end