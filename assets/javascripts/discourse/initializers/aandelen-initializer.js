import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "connect-aandelen-tab",
  initialize() {
    withPluginApi("1.0.0", (api) => {
      api.connectToPluginOutlet(
        "user-nav",
        "aandelen-user-nav-item"
      );
    });
  },
};