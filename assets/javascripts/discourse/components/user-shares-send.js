import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";

export default class UserSharesSend extends Component {
  @tracked amount = 0;

  @action
  updateAmount(event) {
    this.amount = event.target.value;
  }

  @action
  async sendShares(event) {
    event.preventDefault();

    try {
      await ajax(`/shares/user/${this.args.user.username}/send`, {
        type: "POST",
        data: { amount: this.amount }
      });
      alert("Shares sent!");
    } catch (e) {
      alert("Error sending shares");
    }
  }
}
