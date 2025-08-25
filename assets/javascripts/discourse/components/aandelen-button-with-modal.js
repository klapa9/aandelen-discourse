import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import { currentUser } from "discourse/lib/user/current-user";

export default class AandelenButtonWithModal extends Component {
  @tracked modalIsVisible = false;
  @tracked amount = 1;

  get recipient() {
    // Dit werkt in user-profile context: de "model" is de user van het profiel
    return this.args.model;
  }

  @action
  openModal() {
    this.modalIsVisible = true;
  }

  @action
  closeModal() {
    this.modalIsVisible = false;
  }

  @action
  async sendShares() {
    try {
      await ajax("/aandelen/send", {
        type: "POST",
        data: {
          from: currentUser.username,
          to: this.recipient.username,
          amount: this.amount,
        },
      });

      alert(
        `Succes! Je stuurde ${this.amount} aandelen naar ${this.recipient.username}`
      );
      this.closeModal();
    } catch (e) {
      console.error("Fout bij versturen aandelen:", e);
      alert("Er ging iets mis bij het versturen van de aandelen.");
    }
  }
}
