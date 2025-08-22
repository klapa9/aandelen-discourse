import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  // JUISTE MANIER:
  // Geef één object mee met daarin alle sleutels,
  // inclusief de 'component' sleutel.
  api.registerUserMenuTab({
    name: "aandelen",
    label: "Aandelen",
    icon: "coins",
    component: "aandelen-tab", // Deze sleutel moet binnen het object staan
  });
});