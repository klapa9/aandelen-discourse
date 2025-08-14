import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    // Haal het gebruikersmodel op van de bovenliggende route ('user')
    const user = this.modelFor('user');
    console.log("[Aandelen-tab] shares-profile model loaded for user:", user.username);

    // HIER laad je de data. Voor nu gebruiken we hard-coded dummy data.
    // Later haal je dit via de Discourse API uit je plugin's backend.
    const dummyTransactions = [
      { date: new Date('2025-08-12T10:00:00Z'), description: "Ontvangen van @gebruiker1", amount: 50, isPositive: true },
      { date: new Date('2025-08-10T14:30:00Z'), description: "Gegeven aan @gebruiker2 voor hulp", amount: 10, isPositive: false },
      { date: new Date('2025-08-01T09:00:00Z'), description: "Startkapitaal", amount: 100, isPositive: true }
    ];

    // De return value van de model hook is beschikbaar als 'model' in je .hbs template
    // We koppelen de transacties aan het user model.
    user.set('shareTransactions', dummyTransactions);
    return user;
  }
});
