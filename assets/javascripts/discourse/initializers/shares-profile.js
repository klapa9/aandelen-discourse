import { withPluginApi } from "discourse/lib/plugin-api";

function initializeSharesProfile(api) {
  // De 'user' category zorgt ervoor dat de tab op de juiste plek komt:
  // de navigatiebalk van het gebruikersprofiel.
  api.addNavigationBarItem({
    name: 'shares',
    displayName: 'Aandelen',
    route: 'user.shares', // De route waar deze tab naartoe linkt
    category: 'user'
  });
}

export default {
  name: "shares-profile-initializer",
  
  initialize() {
    withPluginApi("1.0.0", initializeSharesProfile);
  }
};