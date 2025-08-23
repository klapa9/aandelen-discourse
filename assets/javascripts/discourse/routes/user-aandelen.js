import UserActivityRoute from "discourse/routes/user-activity";

export default UserActivityRoute.extend({
  // de model hook kan data laden van de server of placeholder teruggeven
  model() {
    return { message: "Hier komen de aandelen van deze gebruiker." };
  }
});
