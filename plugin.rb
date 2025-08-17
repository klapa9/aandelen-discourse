# name: aandelen-discourse
# about: Beheer aandelen van leden
# version: 0.1.0
# authors: klapa9
# url: https://github.com/klapa9/aandelen-discourse

enabled_site_setting :aandelen_enabled


after_initialize do
  Rails.logger.info("Aandelen plugin geladen!")
  load File.expand_path("../lib/shares/engine.rb", __FILE__)
end



