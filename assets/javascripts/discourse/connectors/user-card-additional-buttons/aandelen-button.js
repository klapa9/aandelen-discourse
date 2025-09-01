import { getOwner } from "@ember/application"; 
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/modal/aandelen-modal";

export default {
  setupComponent(args, component) {
    const modal = getOwner(this).lookup("service:modal");
    const currentUser = getOwner(this).lookup("service:current-user").currentUser;

    component.set("openAandelenModal", async () => {
      try {
        // Eerst checken of args.user bestaat
        if (!args.user) {
          console.error("Geen user beschikbaar om aandelen modal voor te openen.");
          return alert("⚠️ Kan modal niet openen: geen user beschikbaar.");
        }

        // Modal openen in historie-only modus als dit de eigen user is
        const showHistoryOnly = currentUser && args.user.id === currentUser.id;

        let senderBalance = 0;
        if (!showHistoryOnly) {
          // Ophalen van huidige saldo van de ingelogde gebruiker
          const data = await ajax("/aandelen/balance.json", { method: "GET" });
          senderBalance = data.balance;
        }
        
        // sluit user-card
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27,
            which: 27,
            bubbles: true
          })
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));
  
        // Modal openen met juiste opties
        modal.show(AandelenModal, {
          model: {
            user: args.user,
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
