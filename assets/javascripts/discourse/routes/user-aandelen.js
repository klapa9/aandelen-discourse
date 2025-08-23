import UserActivityRoute from "discourse/routes/user-activity";

export default class UserAandelenRoute extends UserActivityRoute {
  model() {
    const user = this.modelFor("user");
    return {
      username: user.username,
      message: "Hier komen de aandelen van deze gebruiker."
    };
  }
}
