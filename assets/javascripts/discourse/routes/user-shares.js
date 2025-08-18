import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default class UserSharesRoute extends DiscourseRoute {
  model() {
    let user = this.modelFor("user"); // huidige user uit profiel
    return ajax(`/shares/user/${user.username}`).then((result) => {
      return {
        user,
        balance: result.balance,
        transactions: result.transactions || []
      };
    });
  }
}
