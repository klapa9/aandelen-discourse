import { extendRouter } from 'discourse/extension-api';

export default {
  name: 'extend-user-router-with-shares',
  before: 'inject-discourse-objects',
  initialize() {
    extendRouter('user.user-main-nav-router', function() {
      this.route('shares');
    });
  }
};
