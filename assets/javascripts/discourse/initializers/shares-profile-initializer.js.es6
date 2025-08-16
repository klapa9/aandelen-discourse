import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.6.0", (api) => {
      console.log("[Aandelen-tab] initializer loaded");

      api.addUserProfileTab({
        name: "shares",
        title: "Aandelen",
        route: "user.shares",
      });
    });
  },
};
