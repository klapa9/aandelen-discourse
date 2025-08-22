import { addPluginRouter } from "discourse/lib/plugin-api"; // Corrected import path

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