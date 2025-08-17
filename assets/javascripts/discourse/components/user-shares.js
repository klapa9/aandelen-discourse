import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class UserSharesComponent extends Component {
  @tracked shares = [];

  constructor() {
    super(...arguments);
    this.loadShares();
  }

  async loadShares() {
    try {
      // Hier zou je een API call kunnen doen om aandelen op te halen
      // Voor nu dummy data:
      this.shares = [
        { name: "Discourse Inc.", amount: 10 },
        { name: "OpenAI", amount: 5 },
      ];
    } catch (e) {
      console.error("Kan aandelen niet laden:", e);
    }
  }

  @action
  logShare(share) {
    console.log("Klik op aandeel:", share);
  }
}
