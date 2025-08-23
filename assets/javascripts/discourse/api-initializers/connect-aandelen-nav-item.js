import { apiInitializer } from "discourse/lib/plugin-api"; // The final correction is here

export default apiInitializer("0.1", (api) => {
  api.connectToPluginOutlet(
    "user-nav",
    "aandelen-user-nav-item"
  );
});