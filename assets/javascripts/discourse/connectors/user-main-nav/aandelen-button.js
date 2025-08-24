// assets/javascripts/discourse/connectors/user-main-nav/aandelen-button.js
import { withPluginApi } from "discourse/lib/plugin-api";
import AandelenModal from "discourse/components/aandelen-modal"; // als je de .js hebt

export default {
  name: "aandelen-button-init",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateConnector("user-main-nav", "aandelen-button", (helper) => ({
        actions: {
          openModal() {
            const modalService = helper.container.lookup("service:modal");
            // toon de modal
            modalService.show(AandelenModal);
          }
        }
      }));
    });
  }
};
