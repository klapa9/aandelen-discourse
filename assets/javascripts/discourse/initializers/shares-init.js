import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'shares-plugin',

  initialize() {
    // Zorg dat we minimaal plugin API versie 0.8.7 gebruiken
    withPluginApi('0.8.7', api => {
      // Registreer een custom tab in het gebruikersprofiel
      api.registerUserProfileCustomField('shares', {
        title: 'Shares',              // Titel van het tabblad
        component: 'user-shares-tab', // Ember component die de inhoud rendert
      });
    });
  }
};
