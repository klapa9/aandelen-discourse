import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "@ember/application";

export default {
  name: "aandelen-initializer",
  initialize(container) {
    // Part 1: Define the route using the standard Ember Router
    const router = getOwner(container).lookup("router:main");
    router.map(function () {
      this.route("user", { path: "/u/:username" }, function () {
        this.route("aandelen", { path: "/aandelen" });
      });
    });

    // Part 2: Connect the UI using withPluginApi
    // This provides the 'api' object that DOES have .connectToPluginOutlet
    withPluginApi("0.1", (api) => {
      api.connectToPluginOutlet(
        "user-nav",
        "aandelen-user-nav-item"
      );
    });
  },
};