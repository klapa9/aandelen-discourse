import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    const user = this.modelFor("user");
    console.log("[Aandelen] user-shares route geladen voor:", user.username);

    const dummyTransactions = [
      { date: "2025-08-12", description: "Ontvangen van @gebruiker1", amount: 50 },
      { date: "2025-08-10", description: "Gegeven aan @gebruiker2", amount: -10 },
      { date: "2025-08-01", description: "Startkapitaal", amount: 100 }
    ];

    user.set("shareTransactions", dummyTransactions);
    return user;
  }
});
