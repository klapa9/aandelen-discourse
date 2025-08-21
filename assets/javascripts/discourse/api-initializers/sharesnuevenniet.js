import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.16.0", (api) => {
  // 1) Route onder /u/:username
  console.log("shares api initializer loaded!")
  // Let op: pad is relatief aan /u/:username
  if (api.addRoute) {
    api.addRoute("user.shares", { path: "/shares" });
  }

  // 2) Tab in het user-profiel (klassieke profielnavigatie)
  // Bestaat al lang en is stabiel – guarded voor zekerheid.
  if (api.addUserNavigation) {
    api.addUserNavigation("shares", {
      route: "user.shares",
      title: "Aandelen",
      // Alleen zichtbaar op je eigen profiel (pas aan naar wens)
    });
  }

  // 3) Item in de avatar dropdown (nieuwere API in 3.5)
  // Guarded zodat het op builds zonder deze API niet crasht.
  if (api.addUserMenuPanel) {
    api.addUserMenuPanel({
      name: "shares",
      title: "Shares",
      icon: "chart-line",
      loggedIn: true,
      href(currentUser) {
        return currentUser
          ? `/u/${currentUser.username}/shares`
          : "/login";
      },
    });
  }
});
