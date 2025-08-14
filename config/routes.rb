Discourse::Application.routes.append do
  namespace :shares do
    post "/transfer" => "shares#transfer"
  end
end
