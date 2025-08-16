import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    const user = this.modelFor("user");

    // Dummy data
    const dummyTransactions = [
      { date: "2025-08-12", description: "Ontvangen van @gebruiker1", amount: 50, isPositive: true },
      { date: "2025-08-10", description: "Gegeven aan @gebruiker2", amount: 10, isPositive: false },
      { date: "2025-08-01", description: "Startkapitaal", amount: 100, isPositive: true }
    ];

    user.set("shareTransactions", dummyTransactions);
    return user;
  }
});
