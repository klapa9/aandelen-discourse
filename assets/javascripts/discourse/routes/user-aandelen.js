import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default DiscourseRoute.extend({
  model() {
    // Haal het model (de gebruiker) van de bovenliggende route op.
    const user = this.modelFor("user");
    const username = user.get("username");

    // Maak de API-call naar onze custom controller endpoint.
    // De .json extensie is belangrijk!
    return ajax(`/u/${username}/aandelen.json`).then((result) => {
      return result;
    });
  },
});