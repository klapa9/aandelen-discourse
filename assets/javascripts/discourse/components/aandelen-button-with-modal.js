import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";

export default class AandelenButtonWithModal extends Component {
  @tracked modalIsVisible = false;
  @tracked amount = 1;

  get recipient() {
    // de user van het profiel dat bekeken wordt
    return this.args.outletArgs?.model;
  }

  get sender() {
    // de ingelogde gebruiker
    return this.currentUser;
  }

  @action openModal() {
    this.modalIsVisible = true;
  }

  @action closeModal() {
    this.modalIsVisible = false;
  }

  @action async sendShares() {
    try {
      await ajax("/aandelen/send", {
        type: "POST",
        data: {
          from: this.sender.username,
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
