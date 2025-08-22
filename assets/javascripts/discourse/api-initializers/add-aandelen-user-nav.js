import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  // We gebruiken de JUISTE functie: registerUserMenuTab
  // Deze is specifiek gemaakt voor tabs op een gebruikersprofiel.
  api.registerUserMenuTab("aandelen-tab", {
    // De 'name' wordt gebruikt voor de URL (e.g., /u/username/aandelen)
    name: "aandelen",

    // De tekst die op de tab verschijnt
    label: "Aandelen",

    // Het FontAwesome icoon
    icon: "coins",
  });
});