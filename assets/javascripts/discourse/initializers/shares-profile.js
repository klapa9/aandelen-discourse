import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-initializer",
  
  initialize() {
    withPluginApi("1.0.0", (api) => {

      // DEEL 1: Voeg de knop toe aan de navigatiebalk.
      api.addNavigationBarItem({
        name: 'shares',
        displayName: 'Aandelen',
        route: 'user.shares',
        category: 'user'
      });

      // DEEL 2: Registreer de route '/u/:username/shares'
      api.addRoute('user.shares', { path: 'shares' }, 'user');

      // DEEL 3: Voeg een controller toe voor deze route
      api.modifyClass('controller:user.shares', {
        pluginId: 'shares-profile',
        
        model(params) {
          // Hier kun je API calls doen of data ophalen. Voor nu dummy data:
          return {
            username: params.username,
            shares: [
              { name: 'Apple', amount: 10 },
              { name: 'Tesla', amount: 5 }
            ]
          };
        }
      });

      // DEEL 4: Voeg een template toe (Ember) voor user.shares
      api.registerWidget('user.shares', {
        tagName: 'div',
        html(attrs, state) {
          const sharesList = attrs.model.shares.map(
            s => `<li>${s.name}: ${s.amount} aandelen</li>`
          ).join('');
          
          return `
            <h2>${attrs.model.username}'s Aandelen</h2>
            <ul>${sharesList}</ul>
          `;
        }
      });

    });
  }
};
