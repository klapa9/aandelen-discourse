// Importeer de Router direct vanuit de Discourse core bestanden
import Router from 'discourse/router';

export default {
  name: 'add-shares-route',
  initialize() {
    // We voegen onze route direct toe aan de map-functie van de Router
    Router.map(function() {
      this.route('user', { path: '/u/:username' }, function() {
        // Dit voegt de geneste route 'shares' toe
        // met het pad /u/:username/shares
        this.route('shares'); 
      });
    });
  }
};
