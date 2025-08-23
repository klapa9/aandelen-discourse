import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "aandelen-features",
  after: "inject-objects",

  initialize(container) {
    // This is the corrected line. We use the 'container' argument directly.
    const router = container.lookup("router:main");
    if (router.location.implementation.name !== "none") {
      router.map(function () {
        this.route("user", { path: "/u/:username" }, function () {
          this.route("aandelen", { path: "/aandelen" });
        });
      });
    }

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