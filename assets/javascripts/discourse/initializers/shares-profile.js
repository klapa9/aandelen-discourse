import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile",

  initialize() {
    withPluginApi("0.8", (api) => {
      // Voeg een badge toe op het gebruikersprofiel
      api.modifyUserCard((userCard) => {
        const shares = userCard.user.custom_fields.shares || 0;
        userCard.addBadge(`Aandelen: ${shares}`);
      });
    });
  }
};
