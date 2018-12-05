const glob = require('glob-promise')
const fs = require('fs')
const path = require('path')
const dottie = require('dottie')
const config = require('./config')

const tymlyPath = process.env.TYMLY_PATH

async function main () {
  const output = {}

  const pluginsPath = path.join(tymlyPath, 'plugins', '*')
  const pluginDirPaths = await glob(pluginsPath)

  if (config.plugins) await getPlugins()
  else console.log(`Plugins is set to false in your config. \n To generate state-resources or services, plugins must also be generated...`)
  if (config.stateResources) await getStateResources()
  if (config.services) await getServices()

  async function getPlugins () {
    console.log('Gathering plugin data... \n\n')
    for (const plugin of pluginDirPaths) {
      const pluginDescription = JSON.parse(fs.readFileSync(path.join(plugin, 'package.json')))
      const pluginName = plugin.split('/').pop()
      dottie.set(output, pluginName, {
        description: pluginDescription.description || 'No description was found',
        stateResources: '',
        services: ''
      })
    }
  }

  async function getStateResources () {
    console.log('Gathering State Resource data... \n\n')
    for (const plugin of pluginDirPaths) {
      const pluginName = plugin.split('/').pop()
      const stateResourcePaths = await glob(path.join(plugin, 'lib', 'components', 'state-resources', '*'))
      for (const stateResource of stateResourcePaths) {
        const stateResourceName = stateResource.split('/').pop()
        const docList = await glob(path.join(stateResource, 'doc', '*'))
        for (const doc of docList) {
          let docContents = 'No doc was found.'
          const docTitle = doc.split('/').pop()
          try {
            if (docTitle === 'index.js') {
              docContents = require(doc)
              dottie.set(output, `${pluginName}.stateResources.${stateResourceName}.index`, docContents, { force: true })
            } else if (docTitle === 'example.json') {
              docContents = JSON.parse(fs.readFileSync(doc))
              dottie.set(output, `${pluginName}.stateResources.${stateResourceName}.example`, docContents, { force: true })
            } else {
              console.error('An unknown doc type was found in ', stateResourceName)
            }
          } catch (e) {
            console.error(`There was an issue loading ${doc} please ensure it's contents are correct. \n ${e}`)
          }
        }
      }
    }
  }

  async function getServices () {
    console.log('Gathering Services data... \n\n')
    for (const plugin of pluginDirPaths) {
      const pluginName = plugin.split('/').pop()
      const servicePaths = await glob(path.join(plugin, 'lib', 'components', 'services', '*'))
      for (const service of servicePaths) {
        const serviceName = service.split('/').pop()
        // console.log('got ', serviceName, ' from ', pluginName)
        const docList = await glob(path.join(service, 'doc', '*'))
        for (const doc of docList) {
          let docContents = 'No doc was found.'
          const docTitle = doc.split('/').pop()
          try {
            if (docTitle === 'index.js') {
              docContents = require(doc)
              dottie.set(output, `${pluginName}.services.${serviceName}.index`, docContents, { force: true })
            } else if (docTitle === 'example.json') {
              docContents = JSON.parse(fs.readFileSync(doc))
              dottie.set(output, `${pluginName}.services.${serviceName}.example`, docContents, { force: true })
            } else {
              console.error('An unknown doc type was found in ', serviceName)
            }
          } catch (e) {
            console.error(`There was an issue loading ${doc} please ensure it's contents are correct. \n ${e}`)
          }
        }
      }
    }
  }

  console.log('\n\n output: ', JSON.stringify(output, null, 2))
}

(async () => {
  try {
    await main()
  } catch (e) {
    console.error('GATHERING FAILED')
    console.error('-----------')
    console.error(e)
  }
})()
