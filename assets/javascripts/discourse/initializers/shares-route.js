export default {
  name: "shares-route",

  initialize() {
    // Extend de Ember router
    // Hiermee registreer je de /u/:username/shares route
    // in de User namespace
    const app = requirejs("discourse/app").default;

    app.Router.map(function () {
      this.route("user.shares", {
        path: "/u/:username/shares",
      });
    });
  },
};
