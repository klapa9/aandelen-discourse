import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",

  initialize() {
    console.log("[Aandelen-tab] initializer loaded");

    withPluginApi("0.8.7", (api) => {
      // Voor oudere versies: gebruik addProfileTab in plaats van modifyClass
      api.addProfileTab("shares", {
        title: "Aandelen",
        route: "user.shares",
        icon: "chart-line",
        visible: true // of voeg hier een functie toe voor conditional visibility
      });

      console.log("[Aandelen-tab] tab added");
    });
  },
};
