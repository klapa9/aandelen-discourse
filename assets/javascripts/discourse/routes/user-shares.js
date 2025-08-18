import Route from "@ember/routing/route";
import { ajax } from "discourse/lib/ajax";

export default class UserSharesRoute extends Route {
  model(params) {
    const username = params.username || this.modelFor("user").username;
    return ajax(`/u/${username}/shares`);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    const user = this.modelFor("user");

    controller.setProperties({
      model: model,
      user: user,
      balance: model.balance,
      transactions: model.transactions,
      canSend: model.can_send,
      sendAmount: null,
      loading: false
    });
  }
}
