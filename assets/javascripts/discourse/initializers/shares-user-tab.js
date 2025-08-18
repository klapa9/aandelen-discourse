import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-tab",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.addUserProfileTab("shares", (user) => {
        return {
          name: "shares",
          route: "user.shares",   // dit matcht je route
          title: "Shares"
        };
      });
    });
  },
};
