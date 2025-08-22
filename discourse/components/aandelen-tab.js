import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class AandelenTab extends Component {
  @tracked aandelenAantal = 500;

  get user() {
    return this.args.model;
  }
}