class KrustyBurger {
  /**
   * This is a function to order over the counter at Krusty Burger
   * @param {string} order Order that you want to order
   * @param {string} paymentMethod How do you want to pay
   * @returns {boolean} orderSuccess Whether the payment was successful, and the order contents are available
   * @example
   * krustyBurger.counterOrder(
   *   'Ribwich',
   *   'cash'
   * )
   */
  counterOrder (order, paymentMethod) {
    console.log(`You are ordering ${order} and paying with ${paymentMethod}`)
  }

  /**
   * This is a function to order at the drive-thru at Krusty Burger
   * @param {string} order Order that you want to order
   * @param {string} paymentMethod How do you want to pay
   * @returns {boolean} orderSuccess Whether the payment was successful, and the order contents are available
   * @example
   * krustyBurger.driveThruOrder(
   *   'Ribwich',
   *   'cash'
   * )
   */
  driveThruOrder (order, paymentMethod) {
    console.log(`You are ordering ${order} at the drive-thru and paying with ${paymentMethod}`)
  }
}

module.exports = {
  serviceClass: KrustyBurger,
  bootAfter: ['moes-tavern'],
  schema: {'schema': 'this could be schema'}
}
