# name: aandelen-discourse
# about: Beheer aandelen van leden
# version: 0.1.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :aandelen_enabled

# Registreer de JS-routes en templates voor de "shares" tab
register_asset "javascripts/discourse/routes/user-shares.js", :client_side
register_asset "javascripts/discourse/templates/user/shares.hbs", :client_side

after_initialize do
  Rails.logger.info("Aandelen plugin geladen!")

  User.register_custom_field_type('shares', :integer)
  
  on(:user_created) do |user|
    user.custom_fields['shares'] = 0
    user.save_custom_fields
  end
end


