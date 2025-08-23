import { apiInitializer } from "discourse/lib/plugin-api"; // Corrected: named import

export default apiInitializer("0.1", (api) => {
  api.connectToPluginOutlet(
    "user-nav", 
    "aandelen-user-nav-item"
  );
});