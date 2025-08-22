import { withPluginApi } from "discourse/lib/api";
import I18n from "I18n";

export default {
  name: "add-aandelen-nav-item",
  initialize() {
    withPluginApi("1.0.0", (api) => {
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