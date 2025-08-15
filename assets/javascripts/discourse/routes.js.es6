import { discourseRoutes } from "discourse-common/lib/discourse-routes";

discourseRoutes.map(function() {
  this.route('user', { path: '/u/:username' }, function() {
    this.route('shares'); // Dit maakt de route user.shares
  });
});
