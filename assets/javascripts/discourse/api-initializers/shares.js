import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0", (api) => {
  api.addRoute("user.shares", { path: "/shares" });

  api.addUserNavigation("shares", {
    route: "user.shares",
    title: "Aandelen",
    // Voeg eventueel de 'hideWhen' later weer toe als alles werkt
  });
});