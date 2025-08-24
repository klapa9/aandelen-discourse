import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-button-init",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateConnector("user-main-nav", "aandelen-button", (helper) => {
        const modalService = helper.container.lookup("service:modal");

        // Return een object dat beschikbaar is in de template
        return {
          openModal: () => modalService.show("aandelen-modal")
        };
      });
    });
  }
};
