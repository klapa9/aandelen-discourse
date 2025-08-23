import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class AandelenUserNavItem extends Component {
  @service router;

  // We halen de 'user' op uit de outlet-argumenten
  get user() {
    return this.args.outletArgs.model;
  }
}