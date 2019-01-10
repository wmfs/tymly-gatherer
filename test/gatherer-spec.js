/* eslint-env mocha */

const expect = require('chai').expect
const Gatherer = require('../lib/index')
const path = require('path')

const pluginNameSimpsons = 'simpsons-plugin'
const pluginPathSimpsons = path.join(__dirname, 'fixtures', 'pretend-tymly', 'plugins', pluginNameSimpsons)
const pluginNameFuturama = 'futurama-plugin'
const pluginPathFuturama = path.join(__dirname, 'fixtures', 'pretend-tymly', 'plugins', pluginNameFuturama)

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

  xit('should get a services list for fixtures tymly (simpsons plugin)', async () => {
    const messages = []
    const services = await gatherer.getPluginServices(pluginNameSimpsons, pluginPathSimpsons, messages)
    for (const service of services) {
      // console.log('***', JSON.stringify(service, null, 2))
      expect(['krusty-burger', 'kwik-e-mart', 'springfield-elementary', 'moes-tavern'].includes(service.name))
      expect(service.docs).to.not.eql(undefined)
      if (service.name === 'krusty-burger') {
        expect(service).to.eql(
          {
            'bootAfter': [
              'moes-tavern'
            ],
            'bootBefore': 'Boot before property not found',
            name: 'krusty-burger',
            nameCamel: 'krustyBurger',
            pluginName: 'simpsons-plugin',
            docs: {
              index: {
                description: 'Krusty Burger service',
                quote: 'I will personally spit into every fiftieth burger!'
              }
            },
            'refProperties': 'Ref properties not found',
            'schema': {
              'schema': 'this could be schema'
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

  xit('should get a state resources list for fixtures tymly (simpsons plugin)', async () => {
    const messages = []
    const stateResources = await gatherer.getPluginStateResources(pluginNameSimpsons, pluginPathSimpsons, messages)
    // console.log('STATE RESOURCES: ', JSON.stringify(stateResources, null, 2))
    for (const stateResource of stateResources) {
      expect(['drink-at-moes-tavern', 'eat-at-krusty-burger', 'visit-apu-at-kwik-e-mart'].includes(stateResource.name))
    }

    console.log('messages: ', messages)
  })

  xit('should get a services list for fixtures tymly (futurama plugin)', async () => {
    const messages = []
    const services = await gatherer.getPluginServices(pluginNameFuturama, pluginPathFuturama, messages)
    expect(services).to.eql([])
    expect(messages[0]).to.eql('No services found in futurama-plugin')
  })

  it('should get a state-resources list for fixtures tymly (futurama plugin)', async () => {
    const messages = []
    const services = await gatherer.getPluginStateResources(pluginNameFuturama, pluginPathFuturama, messages)
    expect(services).to.eql([])
    expect(messages[0]).to.eql('No state-resources found in futurama-plugin')
  })

  it('should run the collect function on the Gatherer', async () => {
    await gatherer.collect()
    await gatherer.writeToFile(
      {
        outputFilePath: 'C:\\development\\tymly\\packages\\tymly-gatherer\\test\\output\\gathered-info.json'
      }
    )
    // console.log('output: ', JSON.stringify(output, null, 2))
  })

  // it('should run generateDocumentation function for a plugin', async () => {
  //   const pluginName = 'simpsons-plugin'
  //   const indexContent = gatherer.getPlugin({ pluginName })
  //   const outputFilePath = `C:\\development\\tymly\\packages\\tymly-gatherer\\test\\output\\${pluginName}.md`
  //
  //   await gatherer.generateDocumentation(
  //     indexContent,
  //     {
  //       outputFilePath
  //     }
  //   )
  // })
})
