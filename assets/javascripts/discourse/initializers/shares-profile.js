import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      console.log("[Aandelen-tab] shares-profile initializer loaded");

      // Add the navigation tab
      api.addNavigationBarItem({
        name: "shares",
        displayName: "Aandelen",
        route: "user.shares",
        category: "user",
      });

      // Add the route manually
      api.modifyClass("Router:main", {
        pluginId: "aandelen-discourse",
        map() {
          this.route("user", { path: "/u/:username" }, function () {
            this.route("shares");
          });
        },
      });
    });
  },
};
