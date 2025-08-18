import { withPluginApi } from "discourse/lib/plugin-api";

export default {
 name: "shares-user-tab",
 
 initialize() {
   withPluginApi("0.8.31", (api) => {
     // Add a simple link to shares in user menu for now
     api.decorateWidget("user-menu:before", (helper) => {
       const currentUser = helper.widget.currentUser;
       if (currentUser) {
         return helper.h("li", [
           helper.h("a", {
             href: `/shares/user/${currentUser.username}`,
             className: "shares-link"
           }, "My Shares")
         ]);
       }
     });
   });
 }
};