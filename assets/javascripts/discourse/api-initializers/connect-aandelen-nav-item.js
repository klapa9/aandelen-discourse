import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.1", (api) => {
  api.connectToPluginOutlet(
    "user-nav", 
    "aandelen-user-nav-item"
  );
});