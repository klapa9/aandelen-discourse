import { withPluginApi } from "discourse/lib/api";
import I18n from "I18n";

export default {
  name: "add-aandelen-nav-item",
  initialize() {
    // We use withPluginApi inside a standard initializer
    withPluginApi("1.0.0", (api) => {
      api.modifyClass("model:user", {
        pluginId: "AandelenPlugin",

        // This is a computed property that adds our new item to the default list
        navItems: function () {
          const items = this._super(...arguments);

          // Add our new item if it doesn't already exist
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