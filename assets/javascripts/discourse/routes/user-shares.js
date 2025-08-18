import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";

export default DiscourseRoute.extend({
 model(params) {
   return ajax(`/u/${params.username}/shares`);
 },

 setupController(controller, model) {
   controller.setProperties({
     model: model,
     user: model.user,
     balance: model.balance,
     transactions: model.transactions,
     canSend: model.can_send,
     sendAmount: null,
     loading: false
   });
 }
});