class MoesTavern {
  counterOrder (order, paymentMethod) {
    console.log(`You are ordering ${order} and paying with ${paymentMethod}`)
  }
}

module.exports = {
  serviceClass: MoesTavern
}
