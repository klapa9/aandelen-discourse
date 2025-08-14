import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",
  
  initialize() {
    withPluginApi("1.0.0", (api) => {
      // Only add the navigation bar item (tab)
      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares',
        category: 'user'
      });
      // Remove addRoute and addProfileTab.

      // Your route/controller logic for user.shares is in routes/user-shares.js.es6
      // Your template for user.shares is in assets/templates/user/shares.hbs
      // You do not need to register a widget for this route.
    });
  }
};