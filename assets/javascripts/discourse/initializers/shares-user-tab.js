import { withPluginApi } from "discourse/lib/plugin-api";

export default {
 name: "shares-user-tab",
 
 initialize() {
   withPluginApi("1.0.0", (api) => {
     // Add shares tab to user profile
     api.addUserProfileTab("shares", "shares.title", "chart-line");
     
     // Add route for the shares tab
     api.addUserProfileTabRoute("shares", "user.shares");
   });
 }
};