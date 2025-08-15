import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      console.log("[Aandelen-tab] initializer loaded");

      api.addProfileTab('shares', 'Aandelen', {
        route: 'user.shares'
      });
    });
  }
};
// Dit voegt de 'Aandelen' tab toe aan het gebruikersprofiel