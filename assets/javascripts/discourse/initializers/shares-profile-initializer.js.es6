import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-plugin-initializer",
  // NIEUW: Deze regel zorgt ervoor dat onze code vroeg genoeg draait,
  // voordat de router "op slot" gaat.
  before: 'inject-discourse-objects', 

  initialize() {
    // We gebruiken een API-versie die `modifyClass` ondersteunt.
    withPluginApi("0.8.7", (api) => {
      
      // Dit definieert de route. Dankzij de 'before' hierboven,
      // gebeurt dit nu op het juiste moment.
      api.modifyClass('router:main', {
        pluginId: 'AandelenDiscoursePlugin', 
        map() {
          this._super(...arguments);
          this.route('user', { path: '/u/:username' }, function() {
            this.route('shares');
          });
        }
      });

      // De 'decoratePluginOutlet' code is hier VOLLEDIG VERWIJDERD.
      // Het is niet meer nodig.
    });
  }
};