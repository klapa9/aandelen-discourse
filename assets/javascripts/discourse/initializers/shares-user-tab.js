import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-tab",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Voeg een nieuwe tab toe op het gebruikersprofiel
      api.addUserProfileTab("shares", (user) => {
        return {
          name: "shares",
          route: `user-shares/${user.username}`,
          title: "Shares"
        };
      });
    });
  }
};
