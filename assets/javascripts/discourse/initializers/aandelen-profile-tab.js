import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-profile-tab",

  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.addProfileTab("aandelen", {
        title: "Aandelen",
        route: "user.aandelen",
        connector: "user-aandelen", // dit verwijst naar template/connector
      });
    });
  },
};
