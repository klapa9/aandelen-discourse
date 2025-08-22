import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class AandelenTab extends Component {
  // Dummy data blijft hetzelfde
  @tracked aandelenAantal = 500;

  // Hier zit de correctie:
  // Discourse geeft de gebruiker door als 'model' aan dit component.
  get user() {
    return this.args.model; // NIET this.args.user
  }
}