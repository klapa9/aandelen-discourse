import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  api.registerUserMenuTab({
    name: "aandelen",
    label: "Aandelen",
    icon: "coins",
    component: "aandelen-tab",
  });
});