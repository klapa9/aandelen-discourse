Discourse::Application.routes.append do
  mount ::Shares::Engine, at: "/shares"
end

module Shares
  class Engine < ::Rails::Engine
    isolate_namespace Shares
  end
end

Shares::Engine.routes.draw do
  get "/:username" => "shares#show"
  post "/:username/give" => "shares#give"
end
