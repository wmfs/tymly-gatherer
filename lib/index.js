const glob = require('glob-promise')
const fs = require('fs')
const path = require('path')
const dottie = require('dottie')

module.exports = class Index {
  constructor (options) {
    console.log('\nBooting up Tymly Gatherer')
    console.log('-------------------------')
    this.output = {}
    this.config = options.config
    this.sourceDir = options.sourceDir
    console.log(`Source dir (which should contain /plugins): ${this.sourceDir}`)
    console.log('Config:')
    console.log(JSON.stringify(this.config, null, 2))
  }

  async listStateResourceSummary (pluginsPath, target) {
    const pluginPaths = await glob(pluginsPath)

    for (const pluginPath of pluginPaths) {
      const pluginName = path.basename(pluginPath)
      const stateResourcesRoot = path.join(pluginPath, 'lib', 'components', 'state-resources', '*')
      const stateResourcePaths = await glob(stateResourcesRoot)

      for (const stateResourcePath of stateResourcePaths) {
        const stateResourceDetail = await this.getStateResourceDetail(stateResourcePath)
        console.log(stateResourceDetail)
        const stateResourceName = Object.keys(stateResourceDetail)[0]
        const dottiePath = `${pluginName}.stateResources.${stateResourceName}`
        dottie.set(target, dottiePath, stateResourceDetail[stateResourceName])
      }
    }
  }

  async listPluginSummary () {
    console.log('\n\nGathering plugin data:')
    const pluginSummary = {}
    const pluginsPath = path.resolve(this.sourceDir, 'plugins', '*')
    const pluginDirPaths = await glob(pluginsPath)

    for (const plugin of pluginDirPaths) {
      const pluginDetail = await this.getPluginDetail(plugin)
      const pluginName = pluginDetail.name.split('/').pop()
      console.log(` - ${pluginName}`)
      dottie.set(pluginSummary, pluginName, {
        description: pluginDetail.description || 'No description found'
      })
      await this.listStateResourceSummary(pluginsPath, pluginSummary)
      await this.listServiceSummary(pluginsPath, pluginSummary)
    }

    return pluginSummary
  }

  async listServiceSummary (pluginsPath, target) {
    console.log('#########', pluginsPath)
    const plugins = await glob(pluginsPath)
    for (const plugin of plugins) {
      const pluginName = path.basename(plugin)
      const servicesPath = path.join(plugin, 'lib', 'components', 'services', '*')
      const services = await glob(servicesPath)

      for (const service of services) {
        const serviceDetail = await this.getServiceDetail(service)
        const serviceName = Object.keys(serviceDetail)[0]
        dottie.set(target, `${pluginName}.services.${serviceName}`, serviceDetail[serviceName])
      }
    }
  }

  async getStateResourceDetail (stateResource) {
    const stateResourceDetail = {}
    const stateResourceName = stateResource.split('/').pop()
    const stateResourceDocs = await glob(path.join(stateResource, 'doc', '*'))
    for (const docPath of stateResourceDocs) {
      const docName = docPath.split('/').pop()
      try {
        const docContents = require(path.resolve(docPath)) || 'No doc was found'
        switch (docName) {
          case 'index.js':
            dottie.set(stateResourceDetail, `${stateResourceName}.description`, docContents.description, { force: true })
            break
          case 'example.json':
            dottie.set(stateResourceDetail, `${stateResourceName}.example`, docContents, { force: true })
        }
      } catch (e) {
        console.error(`Something went wrong! \n----------------\n${e}\n\n`)
      }
    }
    return stateResourceDetail
  }

  async getPluginDetail (plugin) {
    const pluginDetail = JSON.parse(fs.readFileSync(path.join(plugin, 'package.json')))
    const pluginName = pluginDetail.name
    const pluginDescription = pluginDetail.description
    return {
      name: pluginName,
      description: pluginDescription,
      stateResources: await this.getStateResourceDetail(plugin),
      services: await this.getServiceDetail(plugin)

    }
  }

  async getServiceDetail (serviceDirPath) {
    const serviceDetail = {}
    const serviceName = path.basename(serviceDirPath)

    const serviceDocs = await glob(path.join(serviceDirPath, 'doc', '*'))
    for (const docPath of serviceDocs) {
      const docName = path.basename(docPath)
      const docContents = require(path.resolve(docPath)) || 'No doc was found'
      dottie.set(serviceDetail, `${serviceName}.${docName.split('.')[0]}`, docContents)
    }
    return serviceDetail
  }
}
