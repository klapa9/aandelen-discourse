import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-init",

  initialize() {
    withPluginApi("1.8.0", (api) => {
      // Profiel-tab toevoegen
      api.addProfileTab("shares", {
        title: "shares.tab", // verwijst naar client locale
        route: "user.shares",
      });

      // Eventueel user-card aanpassen (connector zie hieronder)
    });
  },
};
