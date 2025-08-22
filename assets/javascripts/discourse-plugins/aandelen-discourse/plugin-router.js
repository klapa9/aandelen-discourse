import { addPluginRouter } from "discourse/lib/router";

export default {
  name: "aandelen-plugin-router",

  initialize(container) {
    addPluginRouter("main", (router) => {
      // Dit voegt de /aandelen route toe aan de user paginas
      router.route("user", { path: "/u/:username" }, function () {
        this.route("aandelen");
      });
    });
  },
};