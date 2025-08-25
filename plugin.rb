# frozen_string_literal: true

# name: aandelen-discourse
# about: Een plugin om een aandelen tab toe te voegen aan het gebruikersprofiel.
# version: 0.1
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse
register_svg_icon "handshake" if respond_to?(:register_svg_icon)
after_initialize do
  load File.expand_path("controllers/aandelen_controller.rb", __dir__)

  Discourse::Application.routes.append do
    #get "/u/:username/aandelen" => "aandelen#show"
    post "/aandelen/send" => "aandelen#send"
  end
end