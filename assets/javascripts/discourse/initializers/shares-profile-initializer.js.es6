import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-plugin-final-initializer",

  initialize() {
    // We vragen om een API-versie die `modifyClass` zeker ondersteunt (deze functie bestaat al lang).
    withPluginApi("0.8.7", (api) => {
      console.log("[Aandelen-plugin] Fallback initializer (modifyClass) loaded.");

      // 1. Het navigatie-item toevoegen. Dit deel werkte al correct.
      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares'
      });

      // 2. De route "forceren" door de router class direct aan te passen.
      api.modifyClass('router:main', {
        // Een unieke ID voor onze plugin is hier vereist.
        pluginId: 'AandelenDiscoursePlugin', 

        // We herdefiniëren de 'map' functie van de router.
        map() {
          // !! ZEER BELANGRIJK !!
          // Roep eerst de originele 'map' functie aan.
          // Als je dit vergeet, zullen GEEN van de standaard Discourse-routes werken
          // en zal de hele site crashen.
          this._super(...arguments);

          // Nu de standaard routes zijn geladen, voegen we onze eigen route toe.
          this.route('user', { path: '/u/:username' }, function() {
            this.route('shares');
          });
        }
      });
      
      console.log("[Aandelen-plugin] Route 'user.shares' created via modifyClass.");
    });
  }
};