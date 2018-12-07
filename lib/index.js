const glob = require('glob-promise')
const fs = require('fs')
const path = require('path')
const dottie = require('dottie')

module.exports = class Index {
  constructor (options) {
    console.log('Booting up Tymly Gatherer... ')
    this.output = {}
    this.config = options.config
    this.sourceDir = options.sourceDir
  }

  async listStateResourceSummary (pluginsPath, target) {
    const plugins = await glob(pluginsPath)
    for (const plugin of plugins) {
      const pluginName = plugin.split('/').pop()
      const stateResourcesPath = path.join(plugin, 'lib', 'components', 'state-resources', '*')
      const stateResources = await glob(stateResourcesPath)

      for (const stateResource of stateResources) {
        const stateResourceDetail = await this.getStateResourceDetail(stateResource)
        const stateResourceName = Object.keys(stateResourceDetail)[0]
        dottie.set(target, `${pluginName}.stateResources.${stateResourceName}`, stateResourceDetail[stateResourceName])
      }
    }

  }

  async listPluginSummary () {
    console.log('\n\nGathering plugin data... \n')
    const pluginSummary = {}
    const pluginsPath = path.resolve(this.sourceDir, 'plugins', '*')
    const pluginDirPaths = await glob(pluginsPath)

    for (const plugin of pluginDirPaths) {
      const pluginDetail = await this.getPluginDetail(plugin)
      dottie.set(pluginSummary, [pluginDetail.name], {
        description: pluginDetail.description || 'No description found'
      })
      await this.listStateResourceSummary(pluginsPath, pluginSummary)
      await this.listServiceSummary(pluginsPath, pluginSummary)
    }

    return pluginSummary
  }

  async listServiceSummary (pluginsPath, target) {
    const plugins = await glob(pluginsPath)
    for (const plugin of plugins) {
      const pluginName = plugin.split('/').pop()
      const servicesPath = path.join(pluginsPath, 'lib', 'components', 'services', '*')
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
      const docContents = require(docPath) || 'No doc was found'
      switch (docName) {
        case 'index.js':
          dottie.set(stateResourceDetail, `${stateResourceName}.description`, docContents.description, {force: true})
          break
        case 'example.json':
          dottie.set(stateResourceDetail, `${stateResourceName}.example`, docContents, {force: true})
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

  async getServiceDetail (service) {
    const serviceDetail = {}
    const serviceName = service.split('/').pop()
    const serviceDocs = await glob(path.join(service, 'doc', '*'))
    for (const docPath of serviceDocs) {
      const docName = docPath.split('/').pop()
      const docContents = require(docPath) || 'No doc was found'
      dottie.set(serviceDetail, `${serviceName}.${docName.split('.')[0]}`, docContents)
    }

    return serviceDetail
  }
}
