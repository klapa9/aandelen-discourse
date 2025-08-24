import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/aandelen-modal";
import { service } from "@ember/service"; // BELANGRIJK: importeer 'service'

export default {
  name: "aandelen-modal-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      api.modifyClass("controller:user", {
        pluginId: "aandelen-discourse",

        // Stap 1: Injecteer de modal service zodat deze beschikbaar is als 'this.modal'
        modal: service(),

        actions: {
          showAandelenModal() {
            const username = this.model.username;

            // Stap 2: Gebruik de geïnjecteerde service. Dit is veel robuuster.
            const modal = this.modal;

            ajax(`/u/${username}/aandelen.json`).then((data) => {
              modal.show(AandelenModal, { model: data });
            });
          },
        },
      });
    });
  },
};