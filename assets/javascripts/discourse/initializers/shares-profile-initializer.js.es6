import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      console.log("[Aandelen-tab] initializer loaded");

      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares',
        category: 'user' // Belangrijk: zorgt dat het onder het profiel komt
      });
    });
  }
};
