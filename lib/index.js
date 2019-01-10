const debug = require('debug')('tymly-gatherer')
const path = require('path')
const glob = require('glob-promise')
const camelCase = require('lodash.camelcase')
const set = require('lodash.set')
const fs = require('fs')
// const documentation = require('documentation')

module.exports = class TymlyGatherer {
  constructor (options) {
    this.options = options

    this.tymlyDir = this.options.tymlyRootPath
    debug(`tymlyDir: `, this.tymlyDir)

    this.cardscriptSchemaPath = this.options.cardscriptSchemaPath
    debug(`cardscriptSchemaPath: `, this.cardscriptSchemaPath)

    this.pluginsRootDir = path.join(this.tymlyDir, 'plugins')
    debug(`pluginsRootDir: `, this.pluginsRootDir)

    this.assetsDir = options.assetsOutputRootDir
    debug(`assetsDir: `, this.assetsDir)

    this.pluginVersionSource = options.pluginVersionSource || 'npm'
    debug(`pluginVersionSource: `, this.pluginVersionSource)
  }

  // ===============================
  // METHODS USED IN COLLECTING DATA
  // ===============================
  async getPluginPackageJson (plugin) {
    // TODO: Load package.json file and return a parsed object
    // We use this elsewhere: https://www.npmjs.com/package/jsonfile
    // Happy to block using jsonfile.readFileSync() if callbacks are a pain.
    debug(`Getting package.json for ${plugin}`)
    return require(path.join(plugin, 'package.json'))
  }

  async getPluginVersion (pluginPackageJson) {
    //
    // this.pluginVersionSource:
    //   'npm' = Version number should be taken from the latest currently published on NPM
    //   'local' = Version should be taken from that in package.json.
    //
    // TODO: If this.pluginVersionSource === 'npm' then use the name in pluginPackageJson to derive the latest published version number
    if (this.pluginVersionSource === 'npm') {
      // TODO: get from npm registry
    } else {
      return pluginPackageJson.version
    }
  }

  async getService (pluginName, servicePath, messages) {
    debug(`Getting service detail for ${servicePath}`)
    const service = {}
    const serviceDocs = await glob(path.join(servicePath, 'doc', '*')) || {}
    const serviceName = path.basename(servicePath)

    service.name = serviceName
    service.nameCamel = camelCase(serviceName)
    service.pluginName = pluginName
    service.docs = {}

    for (const docPath of serviceDocs) {
      debug(`Found doc file: ${docPath}`)
      const doc = require(docPath)
      for (const property of Object.keys(doc)) set(service, `docs.${path.basename(docPath).split('.')[0]}.${property}`, doc[property])
    }

    try {
      await this.getMainIndex(path.join(servicePath, 'index.js'), service)
    } catch (e) {
      messages.push(`Problem getting main index.js file for ${servicePath}, does it have an index file?`, e)
      debug(`Problem getting main index.js file for ${servicePath}, does it have an index file?`)
    }
    // TODO: all of below :)
    // And to finish, again a different method...
    //   This one's "fun"... grab the actual code of /lib/index.js as a string (i.e. not required this time).
    //   Then run it over "documentaton.js"
    //      https://github.com/documentationjs/documentation/blob/HEAD/docs/NODE_API.md
    //      And have it in the MD format, see how it goes?
    //      But to end-up with a new key/value on our service object:
    //      apiDocs: {WHATEVER COMES OUT OF DOCUMENTATION.JS}
    //
    // Messages
    // --------
    // this.collectionMessages.push() a message string to highlight things like:
    //   * Service with no /doc folder
    //   * Service with no example
    //   * Service with no description
    //   * Service with no schema.json file or schema.j2119 file
    debug(`Finished getting service detail for ${serviceName}`)
    return service
  }

  async getPluginServices (pluginName, pluginPath, messages) {
    const services = []
    debug(`Getting plugin services for: ${pluginName}`)

    const servicePath = await glob(path.join(pluginPath, 'lib', 'components', 'services', '*'))
    if (servicePath.length !== 0) {
      for (const serviceDir of servicePath) {
        services.push(
          await this.getService(pluginName, serviceDir, messages)
        )
      }
    } else {
      debug(`No services found in ${pluginName}`)
      messages.push(`No services found in ${pluginName}`)
    }
    return services
  }

  async getStateResource (pluginName, stateResourcePath, messages) {
    debug(`Getting state-resource detail for ${stateResourcePath}`)
    const stateResource = {}
    const stateResourceDocs = await glob(path.join(stateResourcePath, 'doc', '*')) || {}
    const stateResourceName = path.basename(stateResourcePath)

    stateResource.name = stateResourceName
    stateResource.nameCamel = camelCase(stateResourceName)
    stateResource.pluginName = pluginName
    stateResource.docs = {}

    for (const docPath of stateResourceDocs) {
      debug(`Found doc file: ${docPath}`)
      const doc = require(docPath)
      for (const property of Object.keys(doc)) set(stateResource, `docs.${path.basename(docPath).split('.')[0]}.${property}`, doc[property])
    }

    try {
      await this.getMainIndex(path.join(stateResourcePath, 'index.js'), stateResource)
    } catch (e) {
      messages.push(`Problem getting main index.js file for ${stateResourcePath}, does it have an index file?`, e)
      debug(`Problem getting main index.js file for ${stateResourcePath}, does it have an index file?`)
    }
    // There may be a schema.json file in stateResourcePath, if there is get it (via the jsonfile package?) and add it to our stateResource object:
    // Happy to block using jsonfile.readFileSync() if callbacks are a pain.
    //  jsonSchema: [[SCHEMA.JSON as a parsed Javascript object]]
    //
    // There may be a schema.j2119 file in there... load it as a string, then somehow, parse it into an array, so each line is a new element in the array (as a string).
    // And add it to our stateResource object:
    //  schemaJ2119: The array of strings, as described as above.
    //
    // Messages
    // --------
    // this.collectionMessages.push() a message string to highlight things like:
    //   * State resource with no /doc folder
    //   * State resource with no example
    //   * State resource with no description
    //   * State resource with no schema.json file or schema.j2119 file
    debug(`Finished getting state-resource detail for ${stateResourceName}`)
    return stateResource
  }

  async getPluginStateResources (pluginName, pluginPath, messages) {
    const stateResources = []
    // TODO: Loop over state-resources in this dir and await this.getStateResource(pluginName, stateResourcePath)
    // servicePath is path.join(pluginPath, 'lib', 'components', 'state-resources')
    // Be careful... not all plugins will have a state-resources dir.
    debug(`Getting State Resources for: ${pluginName}`)

    const stateResourcePath = await glob(path.join(pluginPath, 'lib', 'components', 'state-resources', '*'))
    if (stateResourcePath.length !== 0) {
      for (const stateResourceDir of stateResourcePath) {
        stateResources.push(
          await this.getStateResource(pluginName, stateResourceDir, messages)
        )
      }
    } else {
      debug(`No state-resources found in ${pluginName}`)
      messages.push(`No state-resources found in ${pluginName}`)
    }
    return stateResources
  }

  async getCardscriptSummary () {
    // TODO: Return cardscript info, ready for building docs from...
    // So expect this.cardscriptSchemaPath to be pointing to a schema.json file somewhere on this file system, containing:
    //   https://github.com/wmfs/cardscript/blob/master/packages/cardscript-schema/lib/schema.json
    // This has been attacked already by Meena?
    // https://github.com/wmfs/cardscript/blob/master/packages/cardscript-doc-generator/lib/collate-data.js
    //
    // But don't we have a new AdaptiveCards-like version now?
    //
    // But returning the same as collate-data.js would do it, I think?
    //
    // With that in mind...
    // * Feels like we need another Cardscript package... "cardscript-metadata".
    // * That is just collate-data.js exposed.
    // * Except you'd have to pass it the pass it the schema.json object, instead of it doing this:
    //      path.resolve(__dirname, './../../../packages/cardscript-schema/lib/schema.json')
    // * That way we can jsonfile.readFileSync(this.cardscriptSchemaPath) and pass it in from here?
    // * And that README generating stuff for Cardscript, with a small tweak, can carry on?
  }

  async collect () {
    // Reset things:
    this.collectionMessages = []
    this.collected = {
      plugins: [],
      cardscriptComponents: {}
    }

    // TODO: loop over dirs in this.pluginsRootDir and push a plugin object onto this.collected.plugins
    // Worth debug(name and version) as we go.
    const pluginsToCheck = await glob(path.join(this.pluginsRootDir, '*'))
    debug(`Looping through plugins in: ${this.pluginsRootDir}`)
    for (const plugin of pluginsToCheck) {
      debug(`Plugin Name: ${path.basename(plugin)}`)
      const pluginName = path.basename(plugin)
      const packageJson = await this.getPluginPackageJson(plugin)
      this.collected.plugins.push(
        {
          'name': pluginName,
          'nameCamel': camelCase(path.basename(plugin)),
          'packageJson': packageJson,
          'version': await this.getPluginVersion(packageJson),
          'services':
            await this.getPluginServices(pluginName, plugin, this.collectionMessages),
          'stateResources':
            await this.getPluginStateResources(pluginName, plugin, this.collectionMessages)
        }
      )
    }
    // TODO: Add info about Cardscript components
    // cardscriptSummary: await this.getCardscriptSummary()

    return this.collected
  }

  async getMainIndex (indexPath, assignee) {
    const data = require(indexPath)
    assignee.schema = data.schema || 'Schema not found'
    assignee.bootBefore = data.bootBefore || 'Boot before property not found'
    assignee.bootAfter = data.bootAfter || 'Boot after property not found'
    assignee.refProperties = data.refProperties || 'Ref properties not found'
  }

  // =====================================================================
  // METHODS USED TO GET STUFF ON THE COLLECTED DATA (i.e. this.collected)
  // =====================================================================

  getPluginList () {
    return this.collected.plugins
  }

  getPlugin (options) {
    return this.collected.plugins[options.pluginName]
  }

  getServiceList (options) {
    return this.collected.plugins[options.pluginName].services
  }

  getStateResourceList (options) {
    return this.collected.plugins[options.pluginName].stateResources
  }

  writeToFile (options) {
    // Assume options.outputFilePath=c:\blah\gathered-info.json
    fs.writeFileSync(options.outputFilePath, JSON.stringify(this.collected, null, 2))
  }
}
