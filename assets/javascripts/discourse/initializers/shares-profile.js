import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile",

  initialize() {
    withPluginApi("0.8", (api) => {
      api.decorateWidget("user-card:after", (helper) => {
        const user = helper.attrs.user;
        if (!user || !user.custom_fields) return;

        const shares = user.custom_fields.shares || 0;

        return helper.h("div.shares-badge", `Aandelen: ${shares}`);
      });
    });
  },
};


