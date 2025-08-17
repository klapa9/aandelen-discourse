import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-init",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.addUserProfileTab("shares", (user) => {
        return {
          name: "Shares",
          title: "Aandelen",
          icon: "chart-line",
          component: "user-shares" // Ember component die we hieronder maken
        };
      });
    });
  }
};
