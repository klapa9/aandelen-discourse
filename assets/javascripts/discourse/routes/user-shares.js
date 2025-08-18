import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default DiscourseRoute.extend({
 model() {
   return ajax(`/u/${this.modelFor("user").username}/shares`);
 },

 setupController(controller, model) {
   this._super(controller, model);
   controller.setProperties({
     model: model,
     user: this.modelFor("user"),
     balance: model.balance,
     transactions: model.transactions,
     canSend: model.can_send,
     sendAmount: null,
     loading: false
   });
 }
});