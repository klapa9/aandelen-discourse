import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile-tab",

  initialize() {
    withPluginApi("1.15.0", (api) => {
      api.addProfileTab("aandelen", (user, currentUser) => {
        const isOwnProfile = currentUser && currentUser.id === user.id;
        const shares = user?.custom_fields?.shares || 0;

        return {
          name: "aandelen",
          title: "Aandelen",
          priority: 100,
          contents() {
            const container = document.createElement("div");
            container.className = "user-main-info"; // standaard profielcontainer styling

            if (isOwnProfile) {
              container.innerHTML = `
                <div class="user-main-info-header">
                  <h2 class="title">Jouw aandelen</h2>
                </div>
                <div class="user-main-info-body">
                  <p>Je bezit momenteel <strong>${shares}</strong> aandelen.</p>
                </div>
              `;
            } else {
              container.innerHTML = `
                <div class="user-main-info-header">
                  <h2 class="title">Aandelen van ${user.username}</h2>
                </div>
                <div class="user-main-info-body">
                  <p>Deze gebruiker bezit momenteel <strong>${shares}</strong> aandelen.</p>
                  <button class="btn btn-primary give-shares-btn">
                    Schenk aandelen
                  </button>
                </div>
              `;

              container.querySelector(".give-shares-btn").addEventListener("click", () => {
                api.showModal("modal", {
                  title: `Schenk aandelen aan ${user.username}`,
                  body: `Hier kun je later het aantal aandelen kiezen en overdragen.`,
                });
              });
            }

            return container;
          },
        };
      });
    });
  },
};

