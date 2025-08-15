import { discourseRoutes } from "discourse-common/lib/discourse-routes";

discourseRoutes.map(function() {
  this.route('user', { path: '/u/:username' }, function() {
    this.route('shares'); // dit maakt 'user.shares'
  });
});

// Dit voegt de route 'user.shares' toe, die we later gebruiken in onze initializer