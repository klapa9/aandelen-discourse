import { addPluginRouter } from "discourse/lib/router";

export default {
  name: "aandelen-router",
  initialize() {
    addPluginRouter("main", (router) => {
      router.route("user", { path: "/u/:username" }, function () {
        this.route("aandelen", { path: "/aandelen" });
      });
    });
  },
};