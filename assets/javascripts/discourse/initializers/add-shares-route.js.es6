import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "add-shares-route",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      api.routeMap(function() {
        // Dit voegt een geneste route 'shares' toe aan de bestaande 'user' route.
        // Het pad wordt /u/:username/shares
        this.route('user', { path: '/u/:username' }, function() {
          this.route('shares'); 
        });
      });
    });
  }
};
