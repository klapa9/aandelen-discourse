import { withPluginApi } from "discourse/lib/plugin-api";
import { initialize as initializeRouter } from "discourse/lib/router";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      console.log("[Aandelen-tab] shares-profile initializer loaded");

      // Handmatige routerregistratie
      api.modifyClass("Router:main", {
        pluginId: "aandelen-discourse",

        map() {
          this.route("user", { path: "/u/:username" }, function () {
            this.route("shares");
          });
        },
      });

      // Voeg de navigatietab toe
      api.addNavigationBarItem({
        name: "shares",
        displayName: "Aandelen",
        route: "user.shares",
        category: "user",
      });
    });
  },
};
