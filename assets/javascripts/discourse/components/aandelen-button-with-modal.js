import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default class AandelenButtonWithModal extends Component {
  @tracked modalIsVisible = false;
  @tracked amount = 1;
  @tracked balance = 0; // huidige aandelen van ingelogde gebruiker

  get recipient() {
    return this.args.user;
  }

  get sender() {
    return this.currentUser;
  }

  @action
  async openModal() {
    this.modalIsVisible = true;

    try {
      const result = await ajax("/aandelen/balance");
      this.balance = result.balance;

      if (this.amount > this.balance) {
        this.amount = this.balance;
      }
    } catch (e) {
      console.error("Kan balance niet ophalen:", e);
    }
  }

  @action
  closeModal() {
    this.modalIsVisible = false;
  }

  @action
  async sendShares() {
    if (this.amount > this.balance) {
      alert("Je kunt niet meer aandelen versturen dan je bezit!");
      return;
    }

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

      // update balance direct
      this.balance -= this.amount;
      this.amount = Math.min(this.amount, this.balance);

    } catch (e) {
      console.error("Fout bij versturen aandelen:", e);
      alert("Er ging iets mis bij het versturen van de aandelen.");
    }
  }
}
