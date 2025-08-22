import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class AandelenTab extends Component {
  // We gebruiken @tracked om de data 'reactief' te maken.
  // Als deze waarde verandert, zal de template automatisch updaten.
  @tracked aandelenAantal = 500; // Dummy data

  // 'args' bevat alle argumenten die aan het component worden meegegeven.
  // Voor een user-nav component is 'user' altijd beschikbaar.
  get user() {
    return this.args.user;
  }
}