import Route from "@ember/routing/route";
import { ajax } from "discourse/lib/ajax";

export default class UserSharesRoute extends Route {
  model() {
    let user = this.modelFor("user");
    return ajax(`/u/${user.username}/shares.json`);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.setProperties({
      model,
      user: this.modelFor("user"),
      balance: model.balance,
      transactions: model.transactions,
      canSend: model.can_send,
      sendAmount: null,
      loading: false,
    });
  }
}

