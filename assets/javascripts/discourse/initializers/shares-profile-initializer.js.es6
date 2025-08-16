import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    console.log("[Aandelen-tab] initializer loaded");

    withPluginApi("0.8.7", (api) => {
      api.addUserProfileTab("shares", {
        title: "Aandelen",
        icon: "chart-line",
        route: "user.shares",
      });
    });
  },
};

