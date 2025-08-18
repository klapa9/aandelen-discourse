import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class UserSharesSend extends Component {
 @tracked amount = null;

 @action
 updateAmount(event) {
   this.amount = parseFloat(event.target.value) || 0;
 }

 @action
 sendShares() {
   if (this.amount > 0) {
     this.args.onSend(this.amount);
     this.amount = null;
   }
 }
}