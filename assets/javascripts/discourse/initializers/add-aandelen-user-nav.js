import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  api.addUserNav("aandelen", {
    // De naam van de route/het component dat we willen tonen
    component: "aandelen-tab",

    // Het label dat op de knop komt te staan (directe tekst)
    label: "Aandelen",

    // Het icoon (in dit geval een 'coin' symbool van FontAwesome)
    icon: "coins",

    // De class voor eventuele styling
    className: "aandelen-tab",

    // Bepaal hier wie de tab mag zien.
    shouldShow: (user) => {
      return true;
    },
  });
});