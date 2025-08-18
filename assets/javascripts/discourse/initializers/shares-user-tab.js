import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-tab",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.addUserProfileTab("shares", (user) => {
        return {
          name: "shares",
          route: "user.shares",      // 👈 moet overeenkomen met addRoute
          title: "Shares",
          model: { username: user.username } // 👈 username param doorgeven
        };
      });
    });
  }
};

