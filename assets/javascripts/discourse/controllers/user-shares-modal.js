import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { ajax } from "discourse/lib/ajax";

export default Controller.extend(ModalFunctionality, {
  loading: false,
  balance: null,
  transactions: null,
  canSend: false,
  sendAmount: null,

  init() {
    this._super(...arguments);
    this.set("loading", true);

    const username = this.model?.username;
    ajax(`/shares/user/${username}`)
      .then((data) => {
        this.setProperties({
          loading: false,
          balance: data.balance,
          transactions: data.transactions,
          canSend: data.can_send,
        });
      })
      .catch(() => this.set("loading", false));
  },

  actions: {
    sendShares() {
      const username = this.model?.username;
      const amount = Number(this.sendAmount);

      if (!amount || amount <= 0) {
        return;
      }

      this.set("loading", true);

      ajax(`/shares/user/${username}/send`, {
        type: "POST",
        data: { amount },
      })
        .then((data) => {
          this.setProperties({
            loading: false,
            balance: data.balance,
            transactions: data.transactions,
            sendAmount: null,
          });
        })
        .catch(() => this.set("loading", false));
    },
  },
});
