import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class UserSharesTabComponent extends Component {
  @tracked shares = [];

  constructor() {
    super(...arguments);
    // Hier kun je data ophalen via API of service
    this.loadShares();
  }

  async loadShares() {
    // Voorbeeld fetch: vervang door jouw endpoint
    const response = await fetch(`/shares.json?user_id=${this.args.model.user.id}`);
    const data = await response.json();
    this.shares = data.shares;
  }
}
