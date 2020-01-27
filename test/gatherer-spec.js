/* eslint-env mocha */

const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const Gatherer = require('../lib/index')
const path = require('path')

const pluginNameSimpsons = 'simpsons-plugin'
const pluginPathSimpsons = path.join(__dirname, 'fixtures', 'pretend-tymly', 'plugins', pluginNameSimpsons)
const pluginNameFuturama = 'futurama-plugin'
const pluginPathFuturama = path.join(__dirname, 'fixtures', 'pretend-tymly', 'plugins', pluginNameFuturama)

// const mdBoilerPlate = '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n'

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

  it('should get a services list for fixtures tymly (simpsons plugin)', async () => {
    const messages = []
    const services = await gatherer.getPluginServices(pluginNameSimpsons, pluginPathSimpsons, messages)
    for (const service of services) {
      // console.log('***', JSON.stringify(service, null, 2))
      expect(['krusty-burger', 'kwik-e-mart', 'springfield-elementary', 'moes-tavern'].includes(service.name))
      expect(service.docs).to.not.eql(undefined)
      if (service.name === 'krusty-burger') {
        expect(service).to.containSubset(
          {
            // 'apiDocs': '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n\r\n## counterOrder\r\n\r\nThis is a function to order over the counter at Krusty Burger\r\n\r\n### Parameters\r\n\r\n-   `order` **[string][1]** Order that you want to order\r\n-   `paymentMethod` **[string][1]** How do you want to pay\r\n\r\n### Examples\r\n\r\n```javascript\r\nkrustyBurger.counterOrder(\r\r\n  \'Ribwich\',\r\r\n  \'cash\'\r\r\n)\r\n```\r\n\r\nReturns **[boolean][2]** orderSuccess Whether the payment was successful, and the order contents are available\r\n\r\n## driveThruOrder\r\n\r\nThis is a function to order at the drive-thru at Krusty Burger\r\n\r\n### Parameters\r\n\r\n-   `order` **[string][1]** Order that you want to order\r\n-   `paymentMethod` **[string][1]** How do you want to pay\r\n\r\n### Examples\r\n\r\n```javascript\r\nkrustyBurger.driveThruOrder(\r\r\n  \'Ribwich\',\r\r\n  \'cash\'\r\r\n)\r\n```\r\n\r\nReturns **[boolean][2]** orderSuccess Whether the payment was successful, and the order contents are available\r\n\r\n[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String\r\n\r\n[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean\r\n',
            bootAfter: [
              'moes-tavern'
            ],
            bootBefore: 'Boot before property not found',
            name: 'krusty-burger',
            nameCamel: 'krustyBurger',
            pluginName: 'simpsons-plugin',
            docs: {
              description: 'Krusty Burger service',
              quote: 'I will personally spit into every fiftieth burger!'
            },
            refProperties: 'Ref properties not found',
            schema: {
              schema: 'this could be schema'
            }
          }
        )
      } else if (service.name === 'kwik-e-mart') {
        expect(service).to.containSubset(
          {
            // 'apiDocs': '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n\r\n No JSDocs were found :(',
            name: 'kwik-e-mart',
            nameCamel: 'kwikEMart',
            pluginName: 'simpsons-plugin',
            docs: {
              description: 'kwik-e-mart service',
              example: {
                groceries: {
                  list: [
                    'bread',
                    'duff beer'
                  ]
                }
              },
              quote: 'Thank you, come again'
            }
          }
        )
      } else if (service.name === 'springfield-elementary') {
        expect(service).to.eql(
          {
            apiDocs: '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n\r\n No JSDocs were found :(',
            name: 'springfield-elementary',
            nameCamel: 'springfieldElementary',
            pluginName: 'simpsons-plugin',
            docs: {}
          }
        )
      } else if (service.name === 'moes-tavern') {
        expect(service).to.containSubset(
          {
            // 'apiDocs': '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n\r\n No JSDocs were found :(',
            bootAfter: 'Boot after property not found',
            bootBefore: 'Boot before property not found',
            docs: {
              description: 'Moes tavern service',
              quote: 'Sounds like you\'re having a rough Christmas. You know what I blame this on the breakdown of? Society.'
            },
            name: 'moes-tavern',
            nameCamel: 'moesTavern',
            pluginName: 'simpsons-plugin',
            refProperties: 'Ref properties not found',
            schema: 'Service Schema not found'
          }
        )
      }
    }
    for (const message of messages) {
      expect(message.includes('Problem getting main index.js file for service'))
    }
  })

  it('should get a state resources list for fixtures tymly (simpsons plugin)', async () => {
    const messages = []
    const stateResources = await gatherer.getPluginStateResources(pluginNameSimpsons, pluginPathSimpsons, messages)
    // console.log('STATE RESOURCES: ', JSON.stringify(stateResources, null, 2))
    for (const stateResource of stateResources) {
      expect(['drink-at-moes-tavern', 'eat-at-krusty-burger', 'visit-apu-at-kwik-e-mart'].includes(stateResource.name))
    }
    for (const message of messages) {
      expect(message.includes('Problem getting main index.js file for state-resource:') ||
        ('does not contain any JSDocs')
      )
    }
  })

  it('should get a services list for fixtures tymly (futurama plugin)', async () => {
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
        outputFilePath: path.join(__dirname, 'generated', 'gathered-info.json')
      }
    )
    // console.log('output: ', JSON.stringify(output, null, 2))
  })

  it('should run generateDocumentation function for a service with JSDocs', async () => {
    const messages = []
    const pluginName = 'simpsons-plugin'
    const serviceName = 'krusty-burger'
    const indexContent = path.join(
      __dirname,
      'fixtures',
      'pretend-tymly',
      'plugins',
      'simpsons-plugin',
      'lib',
      'components',
      'services',
      serviceName,
      'index.js'
    )

    const outputDirPath = path.join(
      __dirname,
      'generated',
      pluginName
    )
    const outputFile = `${serviceName}.md`
    const apiDocs = gatherer.grabApiDocs(
      indexContent,
      {
        outputDirPath,
        outputFile
      },
      messages
    )
    expect(apiDocs.length).to.be.above(0)
  })

  it('should run generateDocumentation function for a service without JSDocs and receive some warnings', async () => {
    const messages = []
    const pluginName = 'simpsons-plugin'
    const serviceName = 'moes-tavern'
    const indexContent = path.join(
      __dirname,
      'fixtures',
      'pretend-tymly',
      'plugins',
      pluginName,
      'lib',
      'components',
      'services',
      'moes-tavern',
      'index.js'
    )

    const outputDirPath = path.join(
      __dirname,
      'generated',
      pluginName
    )

    const outputFile = `${serviceName}.md`
    const apiDocs = gatherer.grabApiDocs(
      indexContent,
      {
        outputDirPath,
        outputFile,
        pluginName,
        subjectName: serviceName
      },
      messages
    )
    expect(apiDocs.length).to.be.above(0)
  })

  it('should run generateDocumentation function for a service with JSDocs', async () => {
    const messages = []
    const pluginName = 'simpsons-plugin'
    const serviceName = 'krusty-burger'

    const tymlyCorePath = path.resolve(require.resolve('@wmfs/tymly'), '..')
    const indexContent = path.join(
      tymlyCorePath,
      'plugin',
      'components',
      'services',
      'caches'
    )

    const outputDirPath = path.join(
      __dirname,
      'generated',
      pluginName
    )
    const outputFile = `${serviceName}.md`
    const apiDocs = gatherer.grabApiDocs(
      indexContent,
      {
        outputDirPath,
        outputFile
      },
      messages
    )
    expect(apiDocs.length).to.equal(0)
  })
})
