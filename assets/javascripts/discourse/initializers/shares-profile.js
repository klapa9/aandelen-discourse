import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "shares-profile",

  initialize() {
    withPluginApi("0.8", (api) => {
      // Voeg een profiel-tabblad toe
      api.addProfileTab("shares", (user) => {
        return {
          name: "Aandelen",
          action: "showShares",
          icon: "dollar-sign"
        };
      });

      // Widget voor het tabblad
      api.decorateWidget("profile-tab:shares", (widget) => {
        const isSelf = widget.currentUser.id === widget.model.id;
        const shares = widget.model.custom_fields.shares || 0;

        if (isSelf) {
          return widget.h("div.shares-tab", [
            widget.h("p", `Jouw aandelen: ${shares}`)
          ]);
        } else {
          return widget.h("div.shares-tab", [
            widget.h("p", `Aandelen van ${widget.model.username}: ${shares}`),
            widget.h(
              "button.btn.btn-primary",
              {
                onclick: () => {
                  const amount = parseInt(prompt("Aantal aandelen te schenken:"));
                  if (!isNaN(amount) && amount > 0) {
                    fetch(`/shares/transfer.json`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        target_id: widget.model.id,
                        amount: amount
                      })
                    }).then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          alert("Aandelen succesvol overgedragen!");
                          location.reload();
                        } else {
                          alert("Fout: " + (data.errors || "Onbekend"));
                        }
                      });
                  }
                }
              },
              "Schenk aandelen"
            )
          ]);
        }
      });
    });
  }
};
