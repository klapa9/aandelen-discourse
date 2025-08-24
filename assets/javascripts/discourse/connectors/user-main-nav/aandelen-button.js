import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-button-init",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateConnector("user-main-nav", "aandelen-button", (helper) => ({
        actions: {
          openModal() {
            const modalService = helper.container.lookup("service:modal");
            // Gebruik de string-naam van je modal (zonder import)
            modalService.show("aandelen-modal");
          },
        },
      }));
    });
  },
};
