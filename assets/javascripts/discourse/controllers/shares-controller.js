import Controller from "@ember/controller";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default class SharesController extends Controller {
  count = 1;

  @action
  updateCount(event) {
    this.set("count", event.target.value);
  }

  @action
  async giveShares(username) {
    await ajax(`/shares/${username}/give`, {
      type: "POST",
      data: { count: this.count }
    });
    this.send("reloadModel"); // of gewoon opnieuw fetchen
  }
}
