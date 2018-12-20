/* eslint-env mocha */

const expect = require('chai').expect
const Gatherer = require('../lib/index')
const path = require('path')

describe('Test gatherer functions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let gatherer

  it('should get a new Gatherer instance', () => {
    gatherer = new Gatherer(
      {
        tymlyRootPath: path.resolve(__dirname, './fixtures/pretend-tymly'),
        cardscriptRootPath: path.resolve(__dirname, './fixtures/pretend-cardscript'),
        assetsOutputRootDir: path.resolve(__dirname, './output'),
        pluginVersionSource: 'npm'
      }
    )
  })


})
