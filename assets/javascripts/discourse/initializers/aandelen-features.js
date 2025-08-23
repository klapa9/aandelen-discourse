import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "@ember/application";
import I18n from "I18n";

export default {
  name: "aandelen-features",
  after: "inject-objects", // Zorgt ervoor dat onze code op het juiste moment draait

  initialize(container) {
    // DEEL 1: Definieer de route met de standaard Ember Router
    const router = getOwner(container).lookup("router:main");
    if (router.location.implementation.name !== "none") { // Voorkom errors in tests
      router.map(function () {
        this.route("user", { path: "/u/:username" }, function () {
          this.route("aandelen", { path: "/aandelen" });
        });
      });
    }

    // DEEL 2: Voeg de navigatielink toe met de Plugin API
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