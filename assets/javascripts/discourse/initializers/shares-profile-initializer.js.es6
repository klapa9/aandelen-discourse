import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    console.log("[Aandelen-tab] initializer loaded");

    withPluginApi("0.8.7", (api) => {
      api.addUserProfileTab("shares", {
        name: "user.shares",
        route: "user.shares",
        icon: "chart-line",
      });
    });
  },
};

