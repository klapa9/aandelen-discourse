import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class AandelenTab extends Component {
  @tracked aandelenAantal = 500; // Dummy data

  // Ontvang de gebruiker via @model, wat correct is
  get user() {
    return this.args.model;
  }
}