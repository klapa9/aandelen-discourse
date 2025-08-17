import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-init",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.registerUserProfileTab("shares", {
        name: "Shares",
        icon: "chart-line",
        action: "showShares",
      });
    });
  },
};
