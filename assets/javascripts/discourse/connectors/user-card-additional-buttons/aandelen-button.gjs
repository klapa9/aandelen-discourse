import Component from "@glimmer/component";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import DButton from "discourse/components/d-button";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/aandelen-modal";

export default class AandelenButton extends Component {
  get currentUser() {
    const currentUser = getOwner(this).lookup("service:current-user");
    return currentUser?.currentUser || currentUser;
  }

  get targetUser() {
    return this.args.outletArgs?.user;
  }

  @action
  async openAandelenModal() {
    try {
      const modal = getOwner(this).lookup("service:modal");

      if (!this.targetUser) {
        // eslint-disable-next-line no-console
        console.error("Geen user beschikbaar om aandelen modal voor te openen.");
        return alert("Kan modal niet openen: geen user beschikbaar.");
      }

      const showHistoryOnly =
        this.currentUser && this.targetUser.id === this.currentUser.id;

      let senderBalance = 0;
      if (!showHistoryOnly) {
        const data = await ajax("/aandelen/balance.json", { method: "GET" });
        senderBalance = data.balance;
      }

      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          keyCode: 27,
          which: 27,
          bubbles: true,
        })
      );
      await new Promise((resolve) => requestAnimationFrame(resolve));

      modal.show(AandelenModal, {
        model: {
          user: this.targetUser,
          senderBalance,
        },
        showHistoryOnly,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Fout bij openen modal:", e);
      alert(`Kan modal niet openen: ${e.message}`);
    }
  }

  <template>
    <DButton
      @action={{this.openAandelenModal}}
      class="btn-primary"
      @label="aandelen_discourse.open_modal"
    />
  </template>
}
