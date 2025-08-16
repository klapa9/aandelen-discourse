import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "aandelen-plugin-initializer",

  initialize() {
    withPluginApi("0.8.7", (api) => {
      // Dit deel was correct en definieert de route op de achtergrond.
      // We laten dit ongewijzigd.
      api.modifyClass('router:main', {
        pluginId: 'AandelenDiscoursePlugin', 
        map() {
          this._super(...arguments);
          this.route('user', { path: '/u/:username' }, function() {
            this.route('shares');
          });
        }
      });

      // NIEUW: Dit is de moderne manier om de visuele tab toe te voegen.
      // We "decoreren" de navigatiebalk van het profiel met onze eigen template.
      api.decoratePluginOutlet(
        'user-profile-primary-nav', // De naam van de outlet
        function(elem, args) {
          // Deze functie wordt uitgevoerd om de content te renderen.
          // 'args.model' is hier het 'user' object van het profiel.
          // We geven dit door aan onze template.
          return { model: args.model };
        },
        {
          // We koppelen deze decoratie aan onze plugin
          pluginId: 'AandelenDiscoursePlugin'
        }
      );
    });
  }
};