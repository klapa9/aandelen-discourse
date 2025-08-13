# name: Aandelen-plugin
# about: Beheer en deel van Magast aandelen
# version: 0.1
# authors: [Jouw Naam]
# url: https://github.com/klapa9/magast-aandelen

enabled_site_setting :magast_enabled

after_initialize do
  add_routes do
    post "/shares/transfer" => "shares#transfer"
  end
end
