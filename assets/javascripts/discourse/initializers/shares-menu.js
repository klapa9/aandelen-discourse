import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

export default {
  name: "shares-menu",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Voeg onderaan het gebruikersmenu een knop “Shares” toe
      api.decorateWidget("user-menu:footer", (helper) => {
        const currentUser = helper.widget.currentUser;
        if (!currentUser) {
          return;
        }

        return helper.h("li.menu-links-row", [
          helper.h(
            "button.btn.btn-icon-text",
            {
              title: "Shares",
              onclick() {
                showModal("user-shares-modal", {
                  model: { username: currentUser.username },
                });
              },
            },
            [helper.h("span", "Shares")]
          ),
        ]);
      });
    });
  },
};
