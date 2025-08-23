import UserActivityRoute from "discourse/routes/user-activity";

export default UserActivityRoute.extend({
  model() {
    return { message: "Hier komen de aandelen van deze gebruiker." };
  }
});
