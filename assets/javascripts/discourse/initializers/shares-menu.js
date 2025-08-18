import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

export default {
  name: "shares-menu",

  initialize() {
    withPluginApi("1.6.0", (api) => {
      api.addUserMenuPanel({
        id: "shares",
        icon: "coins", // FontAwesome/Discourse icon
        label: "Shares",
        onClick(currentUser) {
          showModal("user-shares-modal", {
            model: { username: currentUser.username },
          });
        },
      });
    });
  },
};
