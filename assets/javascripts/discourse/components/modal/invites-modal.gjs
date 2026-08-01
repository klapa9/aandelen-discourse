import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import { ajax } from "discourse/lib/ajax";
import { i18n } from "discourse-i18n";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/aandelen-modal";

export default class InvitesModal extends Component {
  @tracked invites = [];
  @tracked remainingThisYear = 0;
  @tracked totalAllowed = 3;
  @tracked status = "can_invite";

  constructor() {
    super(...arguments);
    this.loadInvites();
  }

  async loadInvites() {
    try {
      const currentUser = this.lookupCurrentUser();

      if (!currentUser) {
        // eslint-disable-next-line no-console
        console.error("Geen ingelogde gebruiker gevonden voor invites.");
        return;
      }

      const resp = await ajax(`/aandelen/invites.json?user_id=${currentUser.id}`);

      this.invites = resp.invites || [];
      this.remainingThisYear = resp.remaining || 0;
      this.totalAllowed = resp.max || 3;
      this.status = resp.status || "can_invite";
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Fout bij laden invites:", e);
    }
  }

  get usedInvitesCount() {
    return this.invites.length;
  }

  get statusThisYear() {
    switch (this.status) {
      case "new_member":
        return i18n("aandelen_discourse.new_member_cannot_invite");
      case "can_invite":
        return i18n("aandelen_discourse.can_invite");
      case "limit_reached":
        return i18n("aandelen_discourse.already_invited");
      default:
        return "";
    }
  }

  get statusTotal() {
    return i18n("aandelen_discourse.invites_used", {
      used: this.usedInvitesCount,
      total: this.totalAllowed,
    });
  }

  lookupCurrentUser() {
    const currentUser = getOwner(this).lookup("service:current-user");
    return currentUser?.currentUser || currentUser;
  }

  @action
  backToAandelen() {
    const modal = getOwner(this).lookup("service:modal");
    const currentUser = this.lookupCurrentUser();

    this.args.closeModal();

    modal.show(AandelenModal, {
      model: { user: currentUser },
    });
  }

  @action
  cancel() {
    this.args.closeModal();
  }

  <template>
    <DModal
      @title={{i18n "aandelen_discourse.invites_title"}}
      @closeModal={{@closeModal}}
    >
      <:body>
        <p>{{this.statusThisYear}}</p>
        <p>{{this.statusTotal}}</p>

        {{#if this.usedInvitesCount}}
          <p>{{i18n "aandelen_discourse.your_invites"}}</p>
          <ul>
            {{#each this.invites as |invite|}}
              <li>
                {{#if invite.username}}
                  {{invite.username}}
                {{else}}
                  {{invite.email}}
                  (nog niet geaccepteerd)
                {{/if}}
              </li>
            {{/each}}
          </ul>
        {{/if}}
      </:body>

      <:footer>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            <DButton
              @translatedLabel={{i18n "aandelen_discourse.cancel"}}
              @action={{this.cancel}}
            />
          </div>
          <div>
            <DButton
              @translatedLabel={{i18n "aandelen_discourse.back_to_aandelen"}}
              @action={{this.backToAandelen}}
              class="btn-secondary"
            />
          </div>
        </div>
      </:footer>
    </DModal>
  </template>
}
