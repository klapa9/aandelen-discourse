import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AandelenButtonWithModal extends Component {
  @tracked modalIsVisible = false;

  @action
  openModal() {
    this.modalIsVisible = true;
  }

  @action
  closeModal() {
    this.modalIsVisible = false;
  }
}
