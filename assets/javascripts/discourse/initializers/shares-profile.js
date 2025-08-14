import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      // Add a "Aandelen" tab to user profiles
      api.addProfileTab("shares", {
        icon: "chart-bar",
        title: "Aandelen",
        route: "user.shares",
        templateName: "user/shares",
        shouldDisplay(user, currentUser) {
          // Show tab for all users
          return !!user;
        }
      });
    });
  }
};
