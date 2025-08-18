import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-route",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Registreer de route /u/:username/shares
      api.addRoute("user.shares", { path: "/u/:username/shares" });
    });
  }
};
