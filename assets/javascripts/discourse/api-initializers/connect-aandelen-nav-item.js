import  apiInitializer  from "discourse/lib/plugin-api";

export default apiInitializer("0.1", (api) => {
  // Dit is de moderne, veilige manier om een UI-element toe te voegen.
  api.connectToPluginOutlet("user-nav", "aandelen-user-nav-item");
});