import { getOwner } from "@ember/application"; 
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/aandelen-modal";

export default {
  setupComponent(args, component) {
    const modal = getOwner(this).lookup("service:modal");
    const currentUser = getOwner(this).lookup("service:current-user").currentUser;

    /**
     * Open aandelen modal.
     * @param {Object} user - gebruiker voor wie de modal opent
     */
    component.set("openAandelenModal", async (user) => {
      try {
        // check of user beschikbaar is
        if (!user) {
          console.error("Geen user beschikbaar om aandelen modal voor te openen.");
          return alert("⚠️ Kan modal niet openen: geen user beschikbaar.");
        }

        // Controleer of eigen profiel
        const showHistoryOnly = currentUser && user.id === currentUser.id;

        let senderBalance = 0;
        if (!showHistoryOnly) {
          const data = await ajax("/aandelen/balance.json", { method: "GET" });
          senderBalance = data.balance;
        }

        // sluit user-card als het uit de card komt
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27,
            which: 27,
            bubbles: true
          })
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // Modal openen
        modal.show(AandelenModal, {
          model: {
            user: user,
            senderBalance
          },
          showHistoryOnly
        });
      } catch (e) {
        console.error("Fout bij openen modal:", e);
        alert("⚠️ Kan modal niet openen: " + e.message);
      }
    });
  },
};
