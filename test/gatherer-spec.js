/* eslint-env mocha */

const expect = require('chai').expect
const Gatherer = require('../lib/tymly-gatherer')
const gatherer = new Gatherer(
  {
    sourceDir: './test/fixtures',
    config: {
      plugins: true,
      stateResources: true,
      services: true
    }
  }
)

describe('test gatherer functions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  it('should get the plugin summary from the Simpsons plugin', async () => {
    const summary = await gatherer.listPluginSummary()
    const stateResources = summary['simpsons-plugin'].stateResources
    const services = summary['simpsons-plugin'].services

    console.log(' >>> ', JSON.stringify(services, null, 2))
    expect(summary['simpsons-plugin'].description).to.eql('A plugin for Simpsons related shenanigans')
    expect(Object.keys(stateResources)).to.eql(['drink-at-moes-tavern', 'eat-at-krusty-burger', 'visit-apu-at-kwik-e-mart'])

    expect(stateResources['drink-at-moes-tavern'].example).to.eql({
      'DrinkAtMoesTavern': {
        'Type': 'Task',
        'Resource': 'module:drinkAtMoesTavern',
        'ResourceConfig': {
          'duffQuantity': 6
        }
      }
    })
    expect(stateResources['drink-at-moes-tavern'].description).to.eql('Visit Moe\'s for an ice cold Duff')

    expect(stateResources['eat-at-krusty-burger'].example).to.eql({
      'EatAtKrustyBurger': {
        'Type': 'Task',
        'Resource': 'module:eatAtKrustyBurger',
        'ResourceConfig': {
          'order': [
            'Ribwich',
            'Large Fries',
            'Large Soda'
          ]
        }
      }
    })
    expect(stateResources['eat-at-krusty-burger'].description).to.eql('Visit Krusty Burger and order a Ribwich™')

    expect(stateResources['visit-apu-at-kwik-e-mart'].example).to.eql(undefined)
    expect(stateResources['visit-apu-at-kwik-e-mart'].description).to.eql('Go to the Kwik-E-Mart and buy some ice (May or may not contain Bobo)')

    expect(Object.keys(services)).to.eql(['krusty-burger', 'kwik-e-mart', 'moes-tavern'])
    expect(services['krusty-burger'].index).to.eql({
      'description': 'Krusty Burger service',
      'quote': 'I will personally spit into every fiftieth burger!'
    })
    expect(services['kwik-e-mart'].index).to.eql({
      'description': 'kwik-e-mart service',
      'quote': 'Thank you, come again'
    })
    expect(services['moes-tavern'].index).to.eql({
      'description': 'Moes tavern service',
      'quote': 'Sounds like you\'re having a rough Christmas. You know what I blame this on the breakdown of? Society.'
    })
  })

  // it('should get the service summary from the Simpsons plugin', async () => {
  //   const summary = await gatherer.listServiceSummary()
  // })
})
