import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  // We geven het een duidelijkere naam
  name: "aandelen-plugin-initializer",

  initialize() {
    // We vragen expliciet om een recente API-versie.
    // Dit is de cruciale wijziging die de "routeMap is not a function" fout moet oplossen.
    // Laten we een versie gebruiken die past bij de tijd, bv. "1.15.0".
    withPluginApi("1.15.0", (api) => {
      console.log("[Aandelen-plugin] Initializer loaded with modern API");

      // EERST de route definiëren
      api.routeMap(function() {
        this.route('user', { path: '/u/:username' }, function() {
          this.route('shares');
        });
      });

      // DAARNA het navigatie-item toevoegen dat naar de route linkt
      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares'
        // De 'category' eigenschap wordt hier niet ondersteund en kan weg.
      });

      console.log("[Aandelen-plugin] Route 'user.shares' and navigation item created.");
    });
  }
};