import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-user-tab",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.modifyClass("controller:user", {
        pluginId: "aandelen-discourse",

        navItems() {
          let items = this._super(...arguments);

          items.push({
            name: "shares",
            route: "user.shares",
            title: "Shares",
            icon: "coins",
          });

          return items;
        },
      });
    });
  },
};
