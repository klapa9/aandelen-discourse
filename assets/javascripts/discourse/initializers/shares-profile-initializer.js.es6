import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    console.log("[Aandelen-tab] initializer loaded");

    withPluginApi("1.8.0", (api) => {
      api.addUserProfileTab({
        name: "shares",
        title: "Aandelen",
        route: "user.shares",
      });
      console.log("Aandelen-tab toegevoegd!");
    });
  },
};


