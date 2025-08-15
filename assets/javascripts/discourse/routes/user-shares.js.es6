import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    // Haal het gebruikersmodel op van de bovenliggende 'user' route
    const user = this.modelFor("user");
    console.log("[Aandelen-tab] model loaded for user:", user.username);

    // Dummy data — later vervang je dit door een API-call
    const dummyTransactions = [
      { date: new Date("2025-08-12T10:00:00Z"), description: "Ontvangen van @gebruiker1", amount: 50, isPositive: true },
      { date: new Date("2025-08-10T14:30:00Z"), description: "Gegeven aan @gebruiker2 voor hulp", amount: 10, isPositive: false },
      { date: new Date("2025-08-01T09:00:00Z"), description: "Startkapitaal", amount: 100, isPositive: true }
    ];

    // Voeg de transacties toe aan het user object
    user.set("shareTransactions", dummyTransactions);

    return user;
  }
});
