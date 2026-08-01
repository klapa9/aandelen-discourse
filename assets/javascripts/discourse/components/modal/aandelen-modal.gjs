import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import { eq, not } from "truth-helpers";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import { ajax } from "discourse/lib/ajax";
import { i18n } from "discourse-i18n";
import InvitesModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/invites-modal";

export default class AandelenModal extends Component {
  @tracked amount = "";
  @tracked balance = 0;
  @tracked transactions = [];
  @tracked description = "";
  @tracked users = [];
  @tracked selectedUser = null;
  @tracked activeTab = "send";
  @tracked notificationMessage = null;
  @tracked notificationType = null;

  constructor() {
    super(...arguments);

    this.currentUser = this.lookupCurrentUser();
    this.isSelf = this.currentUser.id === this.args.model.user.id;

    this.loadBalance();
    this.loadUsers();
    this.loadTransactions();
  }

  get modalTitle() {
    if (this.activeTab === "send") {
      return i18n("aandelen_discourse.title_send");
    }

    return i18n("aandelen_discourse.title_transactions");
  }

  get notificationClass() {
    return `aandelen-notification ${this.notificationType}`;
  }

  get toggleLabel() {
    if (this.activeTab === "send") {
      return i18n("aandelen_discourse.show_transactions");
    }

    return i18n("aandelen_discourse.show_send");
  }

  get canSend() {
    return this.selectedUser && this.amount > 0;
  }

  lookupCurrentUser() {
    const currentUser = getOwner(this).lookup("service:current-user");
    return currentUser?.currentUser || currentUser;
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
        (user) =>
          !["system", "discobot"].includes(user.username) &&
          user.id !== this.currentUser.id
      );

      const modalUser = this.args.model.user?.username;
      const userExists = this.users.some((user) => user.username === modalUser);

      this.selectedUser = userExists && modalUser ? modalUser : "";
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Kon gebruikerslijst niet laden:", e);
    }
  }

  @action
  async send() {
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;

    if (!this.amount || this.amount <= 0) {
      this.showNotification(
        "Vul een geldig aantal aandelen in (meer dan 0).",
        "error"
      );
      return;
    }

    if (!this.selectedUser || this.selectedUser === "") {
      this.showNotification("Kies een ontvanger.", "error");
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
        this.showNotification(
          `${this.amount} aandelen verstuurd naar ${this.selectedUser}`,
          "success"
        );
        this.amount = "";
        this.description = "";
        await this.loadBalance();
        await this.loadTransactions();
      } else {
        const errorMessage = resp.errors?.join(", ") || "Onbekend probleem";
        this.showNotification(`Fout: ${errorMessage}`, "error");
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.showNotification(`Server error: ${e.message}`, "error");
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
        // eslint-disable-next-line no-console
        console.error("Geen gebruiker beschikbaar om invites modal te openen.");
        return alert(
          "Kan invites modal niet openen: geen gebruiker beschikbaar."
        );
      }

      modalService.show(InvitesModal, {
        model: { user },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Fout bij openen invites modal:", e);
      alert(`Kan invites modal niet openen: ${e.message}`);
    }
  }

  <template>
    <DModal @title={{this.modalTitle}} @closeModal={{@closeModal}}>
      <:body>
        {{#if this.notificationMessage}}
          <div class={{this.notificationClass}}>
            {{this.notificationMessage}}
          </div>
        {{/if}}

        {{#if (eq this.activeTab "send")}}
          <div class="aandelen-balance">
            <strong>Jouw Saldo:</strong>
            {{this.balance}}
            aandelen<i class="fa fa-wallet"></i>
          </div>
          <label for="aandelen-receiver">{{i18n "aandelen_discourse.to"}}</label>
          <select id="aandelen-receiver" {{on "change" this.updateSelectedUser}}>
            <option value="" selected={{eq this.selectedUser ""}}>
              {{i18n "aandelen_discourse.select_gentleman"}}
            </option>
            {{#each this.users as |user|}}
              <option
                value={{user.username}}
                selected={{eq user.username this.selectedUser}}
              >
                {{user.username}}
              </option>
            {{/each}}
          </select>

          <label for="aandelen-amount">{{i18n "aandelen_discourse.shares"}}</label>
          <input
            id="aandelen-amount"
            type="number"
            min="1"
            max={{this.balance}}
            value={{this.amount}}
            {{on "input" this.updateAmount}}
          />

          <label for="aandelen-description">
            {{i18n "aandelen_discourse.description"}}
          </label>
          <textarea
            id="aandelen-description"
            placeholder={{i18n "aandelen_discourse.description_placeholder"}}
            value={{this.description}}
            {{on "input" this.updateDescription}}
          ></textarea>
        {{/if}}

        {{#if (eq this.activeTab "transactions")}}
          <div class="aandelen-balance">
            <strong>Jouw Saldo:</strong>
            {{this.balance}}
            aandelen<i class="fa fa-wallet"></i>
          </div>
          <h4>{{i18n "aandelen_discourse.recent_transactions"}}</h4>
          <ul>
            {{#each this.transactions as |tx|}}
              <li>
                {{tx.date}}
                -
                {{#if (eq tx.type "sent")}}
                  {{i18n "aandelen_discourse.to"}}
                  <b>{{tx.user}}</b>
                {{else}}
                  {{i18n "aandelen_discourse.from"}}
                  <b>{{tx.user}}</b>
                {{/if}}
                :
                <b>{{tx.amount}}</b>
                {{i18n "aandelen_discourse.shares"}}
                {{#if tx.description}}
                  <br /><em>{{tx.description}}</em>
                {{/if}}
              </li>
            {{/each}}
          </ul>
        {{/if}}
      </:body>

      <:footer>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            {{#if (eq this.activeTab "send")}}
              <DButton
                @translatedLabel={{i18n "aandelen_discourse.send"}}
                class="btn-primary"
                @action={{this.send}}
                disabled={{not this.canSend}}
              />
            {{/if}}
            <DButton
              @translatedLabel={{i18n "aandelen_discourse.cancel"}}
              @action={{this.cancel}}
            />
          </div>

          <div>
            <DButton
              @translatedLabel={{this.toggleLabel}}
              @action={{this.toggleTab}}
              class="btn-secondary"
            />
            {{#if (eq this.activeTab "transactions")}}
              <DButton
                @translatedLabel={{i18n "aandelen_discourse.open_invites"}}
                @action={{this.openInvitesModal}}
                class="btn-secondary"
              />
            {{/if}}
          </div>
        </div>
      </:footer>
    </DModal>
  </template>
}
