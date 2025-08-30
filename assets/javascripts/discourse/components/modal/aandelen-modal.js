import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";
import { ajax } from "discourse/lib/ajax";

export default class AandelenModal extends Component {
  @tracked amount = "";
  @tracked balance = 0;
  @tracked transactions = [];
  @tracked isSelf = false;

  constructor() {
    super(...arguments);

    // currentUser ophalen via owner
    const currentUser = getOwner(this).lookup("service:current-user");
    this.isSelf = currentUser.id === this.args.model.user.id;

    // Alleen balance ophalen
    this.loadBalance();

    // Alleen transacties ophalen als je jezelf bekijkt
    if (this.isSelf) {
      this.loadTransactions();
    }
  }

  @action
  updateAmount(event) {
    this.amount = event.target.value;
  }

  async loadBalance() {
    const resp = await ajax("/aandelen/balance.json");
    this.balance = resp.balance;
  }

  async loadTransactions() {
    const resp = await ajax("/aandelen/transactions.json");
    console.log("🚀 Transacties response:", resp);
    this.transactions = resp.aandelen || [];
  }


  @action
  async send() {
    if (this.isSelf) return; // mag niet naar jezelf verzenden

    const csrfToken = document.querySelector("meta[name=csrf-token]").content;

    try {
      const resp = await ajax("/aandelen/transfer.json", {
        method: "POST",
        data: {
          username: this.args.model.user.username,
          amount: parseInt(this.amount, 10),
        },
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (resp.success) {
        alert(`✅ ${this.amount} aandelen verstuurd naar ${this.args.model.user.username}`);
        this.amount = "";
        await this.loadBalance();
        if (this.isSelf) await this.loadTransactions();
      } else {
        alert("❌ Fout: " + (resp.errors?.join(", ") || "Onbekend probleem"));
      }
    } catch (e) {
      console.error(e);
      alert("⚠️ Server error: " + e.message);
    }
  }

  @action
  cancel() {
    this.args.closeModal();
  }
}