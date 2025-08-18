import { withPluginApi } from "discourse/lib/plugin-api";

export default {
 name: "shares-user-tab",
 
 initialize() {
   withPluginApi("0.8.31", (api) => {
     api.addUserMenuGlyph((widget) => {
       return {
         label: "shares.balance",
         className: "shares-tab",
         href: `/u/${widget.currentUser.username}/shares`
       };
     });
   });
 }
};