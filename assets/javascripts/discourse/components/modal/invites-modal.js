import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import { action } from "@ember/object";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/aandelen-modal";
import { getOwner } from "@ember/application";

export default class InvitesModal extends Component {
  @tracked invites = [];
  @tracked remaining_this_year = 0;
  @tracked total_allowed = 3;
  @tracked status = "can_invite"; // can_invite, limit_reached, new_member

  constructor() {
    super(...arguments);
    this.loadInvites();
  }

  async loadInvites() {
    try {
      const currentUser = getOwner(this).lookup("service:current-user");

      if (!currentUser) {
        console.error("Geen ingelogde gebruiker gevonden voor invites.");
        return;
      }

      // Als de backend per gebruiker werkt, kan je hier bv. user_id meegeven
      const resp = await ajax(`/aandelen/invites.json?user_id=${currentUser.id}`);

      this.invites = resp.invites || [];
      this.remaining_this_year = resp.remaining || 0;
      this.total_allowed = resp.max || 3;
      this.status = resp.status || "can_invite";
    } catch (e) {
      console.error("Fout bij laden invites:", e);
    }
  }

  get usedInvitesCount() {
    return this.invites.length;
  }

  get statusThisYear() {
    switch (this.status) {
      case "new_member":
        return I18n.t("aandelen_discourse.new_member_cannot_invite");
      case "can_invite":
        return I18n.t("aandelen_discourse.can_invite");
      case "limit_reached":
        return I18n.t("aandelen_discourse.already_invited");
      default:
        return "";
    }
  }

  get statusTotal() {
    return I18n.t("aandelen_discourse.invites_used", {
      used: this.usedInvitesCount,
      total: this.total_allowed,
    });
  }

  @action
  backToAandelen() {
    const modal = getOwner(this).lookup("service:modal");
    const currentUser = getOwner(this).lookup("service:current-user");

    this.args.closeModal();

    // open aandelen modal opnieuw met currentUser
    modal.show(AandelenModal, {
      model: { user: currentUser },
    });
  }

  @action
  cancel() {
    this.args.closeModal();
  }
}
