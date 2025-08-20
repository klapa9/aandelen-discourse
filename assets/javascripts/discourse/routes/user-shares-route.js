// assets/javascripts/discourse/routes/user-shares-route.js
import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default DiscourseRoute.extend({
  model() {
    // Haal de 'user' op uit de bovenliggende 'user' route
    const user = this.modelFor("user");
    const username = user.get("username");

    // Roep je Rails controller aan voor de JSON data
    return ajax(`/u/${username}/shares.json`).then((result) => {
      // De 'result' is nu beschikbaar als 'model' in je .hbs template
      return result;
    });
  },
});