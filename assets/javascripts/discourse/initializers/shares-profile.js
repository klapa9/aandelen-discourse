import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      console.log("[Aandelen-tab] shares-profile initializer loaded");

      // 1️⃣ Register the route
      api.addUserProfileRoute("shares", "shares");

      // 2️⃣ Add the navigation tab for the profile
      api.addNavigationBarItem({
        name: "shares",
        displayName: "Aandelen",
        route: "user.shares",
        category: "user",
      });
    });
  },
};
