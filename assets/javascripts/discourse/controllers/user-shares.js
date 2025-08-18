import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class UserSharesController extends Controller {
 @tracked sendAmount = null;
 @tracked loading = false;

 @action
 async sendShares() {
   if (!this.sendAmount || this.sendAmount <= 0) {
     return;
   }

   this.loading = true;

   try {
     const result = await ajax(`/u/${this.user.username}/shares/send`, {
       type: "POST",
       data: { amount: this.sendAmount }
     });

     if (result.success) {
       this.sendAmount = null;
       // Refresh the page data
       const updatedData = await ajax(`/u/${this.user.username}/shares`);
       this.setProperties({
         balance: updatedData.balance,
         transactions: updatedData.transactions
       });
     }
   } catch (error) {
     popupAjaxError(error);
   } finally {
     this.loading = false;
   }
 }
}