import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import InvitesModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/invites-modal";

export default class AandelenModal extends Component {
  @tracked amount = "";
  @tracked balance = 0;
  @tracked transactions = [];
  @tracked isSelf = false;
  @tracked description = "";
  @tracked users = [];          // 👈 lijst met users
  @tracked selectedUser = null; // 👈 gekozen user

  constructor() {
    super(...arguments);

    const currentUser = getOwner(this).lookup("service:current-user");
    this.isSelf = currentUser.id === this.args.model.user.id;

    this.loadBalance();
    this.loadUsers();

    if (this.isSelf) {
      this.loadTransactions();
    } 
  }

  get modalTitle() {
    return this.isSelf
      ? I18n.t("aandelen_discourse.title_self", { username: this.args.model.user.username })
      : I18n.t("aandelen_discourse.title_send");
  }

  @action
  updateSelectedUser(event) {
    this.selectedUser = event.target.value;
  }

  @action
  updateAmount(event) {
    this.amount = event.target.value;
  }

  @action
  updateDescription(event) {
    this.description = event.target.value;
  }

  async loadBalance() {
    const resp = await ajax("/aandelen/balance.json");
    this.balance = resp.balance;
  }

  async loadTransactions() {
    const resp = await ajax("/aandelen/transactions.json");
    this.transactions = resp.aandelen || [];
  }

  async loadUsers() {
    try {
      const resp = await ajax("/aandelen/users.json");

      const currentUser = getOwner(this).lookup("service:current-user");

      // Filter out discobot, system en de huidige gebruiker
      this.users = (resp.users || []).filter(u =>
        !["system", "discobot"].includes(u.username) &&
        u.id !== currentUser.id
      );

      // Check of de user uit de modal (args.model.user) in de lijst staat
      const modalUser = this.args.model.user?.username;
      const userExists = this.users.some(u => u.username === modalUser);

      if (userExists) {
        this.selectedUser = modalUser;
      } else if (this.users.length > 0) {
        this.selectedUser = this.users[0].username; // fallback naar eerste user
      } else {
        this.selectedUser = null; // geen users beschikbaar
      }
    } catch (e) {
      console.error("Kon gebruikerslijst niet laden:", e);
    }
  }



  @action
  async send() {
    if (this.isSelf) return;

    const csrfToken = document.querySelector("meta[name=csrf-token]").content;

    if (!this.amount || this.amount <= 0) {
      alert("❌ Vul een geldig aantal aandelen in (meer dan 0).");
      return;
    }
    if (!this.selectedUser) {
      alert("❌ Kies een ontvanger.");
      return;
    }

    try {
      const resp = await ajax("/aandelen/transfer.json", {
        method: "POST",
        data: {
          username: this.selectedUser, // 👈 gekozen user
          amount: parseInt(this.amount, 10),
          description: this.description
        },
        headers: { "X-CSRF-Token": csrfToken }
      });

      if (resp.success) {
        alert(`✅ ${this.amount} aandelen verstuurd naar ${this.selectedUser}`);
        this.amount = "";
        this.description = "";
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

  @action
  async openInvitesModal() {
    try {
      const modalService = getOwner(this).lookup("service:modal");
      const user = this.args.model.user;

      if (!user) {
        console.error("Geen gebruiker beschikbaar om invites modal te openen.");
        return alert("⚠️ Kan invites modal niet openen: geen gebruiker beschikbaar.");
      }

      modalService.show(InvitesModal, {
        model: { user: user }
      });
    } catch (e) {
      console.error("Fout bij openen invites modal:", e);
      alert("⚠️ Kan invites modal niet openen: " + e.message);
    }
  }
}
