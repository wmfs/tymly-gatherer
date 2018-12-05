const glob = require('glob')
const fs = require('fs')

async function main () {
  // GET THE TYMLY PATH
  const tymlyPath = process.env.TYMLY_PATH

  // const stateResources = await glob(`${tymlyPath}/**/*.js`)
  const srFiles = glob.sync(`${tymlyPath}/plugins/tymly-crypto-plugin/lib/state-resources/add-crypto-entry/*.js`)
  console.log(`From ${tymlyPath}/plugins/tymly-crypto-plugin/lib/state-resources/add-crypto-entry/*.js I got these state-resources: ${srFiles}`)
}

(async () => {
  await main()
})().catch(e => {
  console.error('GATHERING FAILED')
  console.error('-----------')
  console.error(e)
})
