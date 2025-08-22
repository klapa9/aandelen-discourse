import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  // This is the correct, modern way.
  // We provide a function that returns the object.
  api.registerUserMenuTab(() => {
    return {
      name: "aandelen",
      label: "Aandelen",
      icon: "coins",
      component: "aandelen-tab",
    };
  });
});