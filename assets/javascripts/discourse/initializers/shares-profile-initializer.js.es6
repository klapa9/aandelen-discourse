import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("0.8.7", (api) => {
      console.log("[Aandelen-tab] initializer loaded");

      api.addProfileTab('shares', 'Aandelen', 'user.shares');
    });
  }
};
