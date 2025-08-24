import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "initialize-aandelen-route",

  initialize() {
    withPluginApi("0.8.7", (api) => {
      // Voegt de route /u/{username}/aandelen toe
      api.addUsersRoute("aandelen");
    });
  },
};