import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",
  
  initialize() {
    withPluginApi("1.0.0", (api) => {

      // DEEL 1: Voeg de knop toe aan de navigatiebalk.
      // Dit deel was al correct.
      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares', // We linken naar de 'user.shares' route
        category: 'user'
      });

      // DEEL 2: Registreer de 'user.shares' route.
      // Dit is de nieuwe, correcte manier om de route toe te voegen.
      api.on('router:map', (router) => {
        // We zoeken de bestaande 'user' route en voegen er een sub-route aan toe.
        router.route('user', { path: '/u/:username', resetNamespace: true }, function() {
          this.route('shares'); // Dit maakt de URL /u/GEBRUIKERSNAAM/shares mogelijk
        });
      });

    });
  }
};