import Component from "@ember/component";
import { inject as service } from "@ember/service";
import MyModal from "discourse/components/my-modal";

export default Component.extend({
  modal: service(),

  openModal() {
    this.modal.show(MyModal);
  },
});
