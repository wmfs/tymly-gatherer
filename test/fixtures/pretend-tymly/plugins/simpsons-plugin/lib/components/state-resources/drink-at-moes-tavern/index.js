class drinkAtMoesTavern {
  /**
   * This is a function to order at the counter at Moes
   * @param {string} order Order that you want to order
   * @param {string} paymentMethod How do you want to pay
   * @returns {boolean} orderSuccess Whether the payment was successful, and the order contents are available
   * @example
   * moesTavern.counterOrder(
   *   'Duff Beer',
   *   'credit card'
   * )
   */
  counterOrder (order, paymentMethod) {
    console.log(`You are ordering ${order} and paying with ${paymentMethod}`)
  }
}

module.exports = {
  serviceClass: drinkAtMoesTavern
}
