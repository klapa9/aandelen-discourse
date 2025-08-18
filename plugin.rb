
# frozen_string_literal: true
# name: aandelen-discourse
# about: A plugin to manage user shares and transactions
# version: 1.0.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :shares_enabled

register_asset "stylesheets/shares.scss"

after_initialize do
 # Load plugin files
 [
   '../app/models/user_share.rb',
   '../app/models/share_transaction.rb',
   '../app/controllers/shares_controller.rb',
   '../app/serializers/user_share_serializer.rb',
   '../app/serializers/share_transaction_serializer.rb'
 ].each { |path| load File.expand_path(path, __FILE__) }

 # Add routes
 Discourse::Application.routes.append do
   get '/u/:username/shares' => 'shares#show'
   post '/u/:username/shares/send' => 'shares#send_shares'
   get '/shares/transactions' => 'shares#transactions'
 end

 # Add user shares association
 add_to_class(:user, :user_share) do
   has_one :user_share, dependent: :destroy
   
   def shares_balance
     user_share&.balance || 0
   end
   
   def initialize_shares
     create_user_share(balance: 100) unless user_share # Give new users 100 shares
   end
 end

 # Initialize shares for new users
 on(:user_created) do |user|
   user.initialize_shares
 end
end

# Site settings
register_site_setting_type 'shares', 'shares'