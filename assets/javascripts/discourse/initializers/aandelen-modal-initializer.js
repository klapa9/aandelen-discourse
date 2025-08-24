import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/aandelen-modal";
import { service } from "@ember/service";

export default {
  name: "aandelen-modal-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      api.modifyClass("controller:user", {
        pluginId: "aandelen-discourse",

        modal: service(),

        actions: {
          showAandelenModal() {
            const username = this.model.username;
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