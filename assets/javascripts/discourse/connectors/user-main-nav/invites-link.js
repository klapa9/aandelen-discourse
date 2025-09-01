import { getOwner } from "@ember/application";
import InvitesModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/invites-modal";

export default {
  setupComponent(args, component) {
    component.set(
      "openInvitesModal",
      async function () {
        try {
          const modal = getOwner(component).lookup("service:modal");
          modal.show(InvitesModal, {
            model: { user: args.user }
          });
        } catch (e) {
          console.error("Fout bij openen invites modal:", e);
          alert("⚠️ Kan modal niet openen: " + e.message);
        }
      }.bind(component) // belangrijk: bind hier de component!
    );
  }
};
