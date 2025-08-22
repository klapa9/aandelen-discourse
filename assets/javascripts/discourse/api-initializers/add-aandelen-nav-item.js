import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

export default apiInitializer("0.1", (api) => {
  api.modifyClass("model:user", {
    pluginId: "AandelenPlugin",

    get canBeMessaged() {
      // Dit is nodig om de standaard 'navItems' te behouden
      return this.get("details.can_be_mess మన");
    },
    
    get navItems() {
      const items = this._super(...arguments);
      
      // Voeg ons nieuwe item toe aan de lijst
      items.push({
        id: "aandelen",
        icon: "coins",
        label: I18n.t("aandelen.title"), // Gebruik I18n voor de tekst
        href: `/${this.username}/aandelen`,
        component: "user-aandelen-route",
      });
      
      return items;
    }
  });
});