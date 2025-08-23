import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-initializer",
  initialize(container) {
    // This is the corrected line. We use the 'container' argument directly.
    const router = container.lookup("router:main");
    if (router) { // Check if router exists to be safe
      router.map(function () {
        this.route("user", { path: "/u/:username" }, function () {
          this.route("aandelen", { path: "/aandelen" });
        });
      });
    }

    withPluginApi("0.1", (api) => {
      api.connectToPluginOutlet(
        "user-nav",
        "aandelen-user-nav-item"
      );
    });
  },
};