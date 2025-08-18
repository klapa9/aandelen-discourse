import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default class UserSharesRoute extends DiscourseRoute {
  async model() {
    const user = this.modelFor("user");
    return ajax(`/shares/user/${encodeURIComponent(user.username)}`);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.setProperties({
      user: this.modelFor("user"),
      balance: model.balance,
      transactions: model.transactions,
      canSend: !!model.can_send,
      sendAmount: null,
      loading: false,
    });
  }
}
