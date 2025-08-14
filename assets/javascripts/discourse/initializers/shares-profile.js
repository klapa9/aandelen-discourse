import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-tab",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      api.registerProfileCustomTab("aandelen", {
        title: "Aandelen",
        priority: 100,
        showInProfile(user, currentUser) {
          return true; // altijd zichtbaar
        },
        buildContent(user, currentUser) {
          const isOwnProfile = currentUser && currentUser.id === user.id;
          const shares = user?.custom_fields?.shares || 0;

          const container = document.createElement("div");
          container.className = "user-main-info";

          if (isOwnProfile) {
            container.innerHTML = `
              <div class="user-main-info-header">
                <h2>Jouw aandelen</h2>
              </div>
              <div class="user-main-info-body">
                <p>Je bezit momenteel <strong>${shares}</strong> aandelen.</p>
              </div>
            `;
          } else {
            container.innerHTML = `
              <div class="user-main-info-header">
                <h2>Aandelen van ${user.username}</h2>
              </div>
              <div class="user-main-info-body">
                <p>Deze gebruiker bezit momenteel <strong>${shares}</strong> aandelen.</p>
                <button class="btn btn-primary give-shares-btn">Schenk aandelen</button>
              </div>
            `;

            container.querySelector(".give-shares-btn").addEventListener("click", () => {
              api.showModal("modal", {
                title: `Schenk aandelen aan ${user.username}`,
                body: `
                  <div>
                    <label for="share-amount">Aantal aandelen:</label>
                    <input id="share-amount" type="number" min="1" value="1" style="width: 60px;">
                    <button id="submit-share" class="btn btn-primary">Verstuur</button>
                  </div>
                `,
              });

              document.getElementById("submit-share").addEventListener("click", () => {
                const amount = parseInt(document.getElementById("share-amount").value, 10);
                if (!amount || amount < 1) {
                  alert("Voer een geldig aantal in.");
                  return;
                }

                // TODO: hier voeg je je backend call toe om aandelen over te dragen
                alert(`Je schenkt ${amount} aandelen aan ${user.username}.`);
                api.hideModal();
              });
            });
          }

          return container;
        },
      });
    });
  },
};
