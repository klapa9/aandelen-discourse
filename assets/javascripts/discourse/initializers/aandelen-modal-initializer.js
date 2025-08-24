import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/aandelen-modal";
import { service } from "@ember/service";
import { action } from "@ember/object"; // BELANGRIJK: importeer 'action'

export default {
  name: "aandelen-modal-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      api.modifyClass("controller:user", {
        pluginId: "aandelen-discourse",
        modal: service(),

        // We definiëren de actie nu als een losse methode met de '@action' decorator
        // Dit is een modernere en soms robuustere aanpak
        @action
        showAandelenModal() {
          const username = this.model.username;
          const modal = this.modal;
          ajax(`/u/${username}/aandelen.json`).then((data) => {
            modal.show(AandelenModal, { model: data });
          });
        },
      });
    });
  },
};