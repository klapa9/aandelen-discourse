# name: aandelen-discourse
# about: Beheer aandelen van leden
# version: 0.1.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :aandelen_enabled

after_initialize do
  # Voeg een custom user field "shares" toe als het nog niet bestaat
  unless UserCustomFieldType.exists?(name: "shares")
    UserCustomFieldType.create!(name: "shares", field_type: "integer")
  end

  Rails.logger.info("Aandelen plugin geladen!")
end
