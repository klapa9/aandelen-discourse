import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-initializer",
  initialize() {
    withPluginApi("0.1", (api) => {
      // Both functions are called on the 'api' object here.
      api.addExtraUserRoute("aandelen");

      api.connectToPluginOutlet(
        "user-nav",
        "aandelen-user-nav-item"
      );
    });
  },
};