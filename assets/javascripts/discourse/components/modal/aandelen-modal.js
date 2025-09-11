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
  @tracked description = "";
  @tracked users = [];
  @tracked selectedUser = null;
  @tracked activeTab = "send"; // 👈 standaard tab
  @tracked notificationMessage = null;
  @tracked notificationType = null; // 'success' of 'error'

  constructor() {
    super(...arguments);

    this.currentUser = getOwner(this).lookup("service:current-user");
    this.isSelf = this.currentUser.id === this.args.model.user.id;

    this.loadBalance();
    this.loadUsers();
    this.loadTransactions(); // altijd laden (ook als je iemand anders bekijkt)
  }

  get modalTitle() {
  if (this.activeTab === "send") {
    return I18n.t("aandelen_discourse.title_send");
  } else {
    return I18n.t("aandelen_discourse.title_transactions");
  }
}

  get canSend() {
    return this.selectedUser && this.amount > 0;
  }

  @action
  toggleTab() {
    this.activeTab = this.activeTab === "send" ? "transactions" : "send";
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

  @action
  showNotification(message, type, duration = 5000) {
    this.notificationMessage = message;
    this.notificationType = type;

    // Verberg de notificatie na 'duration' milliseconden
    setTimeout(() => {
      this.notificationMessage = null;
      this.notificationType = null;
    }, duration);
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

      this.users = (resp.users || []).filter(
        (u) =>
          !["system", "discobot"].includes(u.username) &&
          u.id !== this.currentUser.id
      );

      const modalUser = this.args.model.user?.username;
      const userExists = this.users.some((u) => u.username === modalUser);

      if (userExists && modalUser) {
        // profiel van iemand anders => zet die automatisch geselecteerd
        this.selectedUser = modalUser;
      } else {
        // geen geldige user -> fallback naar "selecteer een gentleman"
        this.selectedUser = "";
      }
    } catch (e) {
      console.error("Kon gebruikerslijst niet laden:", e);
    }
  }


  @action
  async send() {
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;

    if (!this.amount || this.amount <= 0) {
      this.showNotification("❌ Vul een geldig aantal aandelen in (meer dan 0).", "error");
      return;
    }
    if (!this.selectedUser || this.selectedUser === "") {
      this.showNotification("❌ Kies een ontvanger.", "error");
      return;
    }

    try {
      const resp = await ajax("/aandelen/transfer.json", {
        method: "POST",
        data: {
          username: this.selectedUser,
          amount: parseInt(this.amount, 10),
          description: this.description,
        },
        headers: { "X-CSRF-Token": csrfToken },
      });

      if (resp.success) {
        this.showNotification(`✅ ${this.amount} aandelen verstuurd naar ${this.selectedUser}`, "success");
        this.amount = "";
        this.description = "";
        await this.loadBalance();
        await this.loadTransactions();
      } else {
        const errorMessage = resp.errors?.join(", ") || "Onbekend probleem";
        this.showNotification(`❌ Fout: ${errorMessage}`, "error");
      }
    } catch (e) {
      console.error(e);
      this.showNotification(`⚠️ Server error: ${e.message}`, "error");
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
        return alert(
          "⚠️ Kan invites modal niet openen: geen gebruiker beschikbaar."
        );
      }

      modalService.show(InvitesModal, {
        model: { user: user },
      });
    } catch (e) {
      console.error("Fout bij openen invites modal:", e);
      alert("⚠️ Kan invites modal niet openen: " + e.message);
    }
  }
}
