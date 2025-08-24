import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/aandelen-modal";
import { service } from "@ember/service";

export default {
  name: "aandelen-modal-initializer",

  initialize() {
    // Test 1: Wordt dit bestand überhaupt uitgevoerd?
    console.log("DEBUG TEST 1: Initializer wordt geladen.");

    withPluginApi("1.0.0", (api) => {
      // Test 2: Wordt de Plugin API correct gestart?
      console.log("DEBUG TEST 2: Plugin API is actief.");

      api.modifyClass("controller:user", {
        pluginId: "aandelen-discourse",
        modal: service(),
        actions: {
          showAandelenModal() {
            // Deze log zal pas verschijnen als alles werkt en je klikt.
            console.log("DEBUG TEST 4: Actie wordt succesvol uitgevoerd!");
            const username = this.model.username;
            const modal = this.modal;
            ajax(`/u/${username}/aandelen.json`).then((data) => {
              modal.show(AandelenModal, { model: data });
            });
          },
        },
      });

      // Test 3: Is de modifyClass-functie zonder fouten doorlopen?
      console.log("DEBUG TEST 3: De controller is (vermoedelijk) succesvol aangepast.");
    });
  },
};