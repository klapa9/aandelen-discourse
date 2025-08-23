import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "aandelen-plugin-initializer",
  initialize() {
    withPluginApi("1.0.0", (api) => {
      // Step 1: Define the new route for /u/username/aandelen
      api.addPluginRouter("main", (router) => {
        router.route("user", { path: "/u/:username" }, function () {
          this.route("aandelen", { path: "/aandelen" });
        });
      });

      // Step 2: Add the navigation link to the user's profile menu
      api.modifyClass("model:user", {
        pluginId: "AandelenPlugin",
        navItems: function () {
          const items = this._super(...arguments);
          if (!items.find((item) => item.id === "aandelen")) {
            items.push({
              id: "aandelen",
              icon: "coins",
              label: I18n.t("aandelen.title"),
              href: `/u/${this.username}/aandelen`,
            });
          }
          return items;
        }.property(),
      });
    });
  },
};