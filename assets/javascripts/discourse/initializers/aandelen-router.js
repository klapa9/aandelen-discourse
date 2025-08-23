import { getOwner } from "@ember/application";

export default {
  name: "aandelen-router",
  initialize(container) {
    const router = getOwner(container).lookup("router:main");
    router.map(function () {
      this.route("user", { path: "/u/:username" }, function () {
        this.route("aandelen", { path: "/aandelen" });
      });
    });
  },
};