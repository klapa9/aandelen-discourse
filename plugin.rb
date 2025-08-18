# frozen_string_literal: true

# name: aandelen-discourse
# about: A plugin to manage user shares and transactions
# version: 1.0.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :shares_enabled

after_initialize do
  # Load models first
  require_relative 'app/models/user_share.rb'
  require_relative 'app/models/share_transaction.rb'
  
  # Load serializers
  require_relative 'app/serializers/user_share_serializer.rb'
  require_relative 'app/serializers/share_transaction_serializer.rb'
  
  # Load controller
  require_relative 'app/controllers/shares_controller.rb'

  # Add routes
  Discourse::Application.routes.append do
    # bestaande API-routes
    scope '/shares' do
      get '/user/:username' => 'shares#show'
      post '/user/:username/send' => 'shares#send_shares'
    end

    # nieuwe profiel-tab route
    get '/u/:username/shares' => 'shares#index'
  end

  # Add user shares association
  add_to_class(:user, :user_share_methods) do
    has_one :user_share, dependent: :destroy
    
    def shares_balance
      user_share&.balance || 0
    end
    
    def ensure_user_share
      self.user_share || create_user_share!(balance: 100)
    end
  end

  # Initialize shares for new users
  on(:user_created) do |user|
    user.create_user_share!(balance: 100)
  end

  # 👇 Nieuw: voeg een tabblad toe aan user-profiel
  add_to_serializer(:user, :can_see_shares) do
    true # later kan je hier permissies instellen
  end

  add_profile_tab("shares",
    icon: "chart-line",  # FontAwesome icon (je kan bv. 'coins' of 'money-bill' nemen)
    label: "shares",     # label in de UI
    path: "shares"       # correspondeert met /u/:username/shares
  )
end
