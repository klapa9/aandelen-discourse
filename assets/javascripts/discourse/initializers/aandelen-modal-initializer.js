import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import AandelenModal from "discourse/plugins/aandelen-discourse/discourse/components/aandelen-modal";

export default {
  name: "aandelen-modal-initializer",

  initialize() {
    withPluginApi("1.0.0", (api) => {
      // We voegen de actie toe aan de controller van de gebruikerspagina
      api.modifyClass("controller:user", {
        // Zorg ervoor dat de plugin-id overeenkomt met je folder naam
        pluginId: "aandelen-discourse", 
        
        actions: {
          showAandelenModal() {
            // Haal de username op van het huidige profiel
            const username = this.model.username;
            
            // Haal de modal-service op om pop-ups te kunnen tonen
            const modal = api.container.lookup("service:modal");

            // Roep onze JSON-endpoint aan
            ajax(`/u/${username}/aandelen.json`).then((data) => {
              // Toon de modal en geef de opgehaalde data door als 'model'
              modal.show(AandelenModal, { model: data });
            });
          },
        },
      });
    });
  },
};