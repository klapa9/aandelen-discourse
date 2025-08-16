import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    console.log("[Aandelen-tab] initializer loaded");

    withPluginApi("0.8.7", (api) => {
      api.modifyClass("controller:user", {
        pluginId: "aandelen-plugin",

        init() {
          this._super(...arguments);

          // Voeg de tab toe
          this.availableTabs.push({
            name: "shares",
            route: "user.shares",
            title: "Aandelen"
          });
        },
      });
    });
  },
};
