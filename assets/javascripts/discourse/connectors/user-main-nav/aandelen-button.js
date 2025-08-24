import Component from "@ember/component";
import { getOwner } from "@ember/application";

export default Component.extend({
  openModal() {
    const modalService = getOwner(this).lookup("service:modal");
    modalService.show("aandelen-modal");
  },
});
