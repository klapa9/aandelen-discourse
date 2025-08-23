import { withPluginApi } from "discourse/lib/plugin-api";
import { addExtraUserRoute } from "discourse/lib/user-routes";
import I18n from "I18n";

export default {
  name: "aandelen-initializer",
  initialize() {
    // This is the official, correct way to add a new user route.
    addExtraUserRoute("aandelen");

    withPluginApi("0.1", (api) => {
      // This part connects our link component to the UI.
      api.connectToPluginOutlet(
        "user-nav",
        "aandelen-user-nav-item"
      );
    });
  },
};