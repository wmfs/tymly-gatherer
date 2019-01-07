/* eslint-env mocha */

const expect = require('chai').expect
const Gatherer = require('../lib/index')
const path = require('path')

const pluginName = 'simpsons-plugin'
const pluginPath = path.join(__dirname, 'fixtures', 'pretend-tymly', 'plugins', pluginName)

describe('Test gatherer functions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let gatherer

  it('should get a new Gatherer instance', () => {
    gatherer = new Gatherer(
      {
        tymlyRootPath: path.resolve(__dirname, './fixtures/pretend-tymly'),
        cardscriptRootPath: path.resolve(__dirname, './fixtures/pretend-cardscript'),
        assetsOutputRootDir: path.resolve(__dirname, './output'),
        pluginVersionSource: 'local'
      }
    )
  })

  it('should get a services list for fixtures tymly', async () => {
    const services = await gatherer.getPluginServices(pluginName, pluginPath)
    for (const service of services) {
      console.log('***', JSON.stringify(service, null, 2))
      expect(['krusty-burger', 'kwik-e-mart', 'springfield-elementary', 'moes-tavern'].includes(service.name))
      expect(service.docs).to.not.eql(undefined)
      if (service.name === 'krusty-burger') {
        expect(service).to.eql(
          {
            name: 'krusty-burger',
            nameCamel: 'krustyBurger',
            pluginName: 'simpsons-plugin',
            docs: {
              index: {
                description: 'Krusty Burger service',
                quote: 'I will personally spit into every fiftieth burger!'
              }
            }
          }
        )
      } else if (service.name === 'kwik-e-mart') {
        expect(service).to.eql(
          {
            'name': 'kwik-e-mart',
            'nameCamel': 'kwikEMart',
            'pluginName': 'simpsons-plugin',
            'docs': {
              'example': {
                'groceries': {
                  'list': [
                    'bread',
                    'duff beer'
                  ]
                }
              },
              'index': {
                'description': 'kwik-e-mart service',
                'quote': 'Thank you, come again',
                'example': {
                  'groceries': {
                    'list': [
                      'bread',
                      'duff beer'
                    ]
                  }
                }
              }
            }
          }
        )
      } else if (service.name === 'springfield-elementary') {
        expect(service).to.eql(
          {
            'name': 'springfield-elementary',
            'nameCamel': 'springfieldElementary',
            'pluginName': 'simpsons-plugin',
            'docs': {}
          }
        )
      } else if (service.name === 'moes-tavern') {
        expect(service).to.eql(
          {
            'name': 'moes-tavern',
            'nameCamel': 'moesTavern',
            'pluginName': 'simpsons-plugin',
            'docs': {
              'index': {
                'description': 'Moes tavern service',
                'quote': 'Sounds like you\'re having a rough Christmas. You know what I blame this on the breakdown of? Society.'
              }
            }
          }
        )
      }
    }
  })

  xit('should run the collect function on the Gatherer', async () => {
    const output = await gatherer.collect()
    console.log('output: ', JSON.stringify(output, null, 2))
  })
})
