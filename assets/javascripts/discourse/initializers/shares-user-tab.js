import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-tab",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.addProfileMenuItem({
        name: "shares",
        icon: "coins", // pak een bestaand FontAwesome icoon
        label: "Shares",
        route: "user.shares", // dit matcht jouw routebestand
      });
    });
  },
};

