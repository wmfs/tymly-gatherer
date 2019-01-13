const debug = require('debug')('tymly-gatherer')
const path = require('path')
const glob = require('glob-promise')
const camelCase = require('lodash.camelcase')
const orderBy = require('lodash.orderby')
const fs = require('fs')
const documentation = require('documentation')

const NO_DESCRIPTION_TEXT = 'No description! :-('

module.exports = class TymlyGatherer {
  constructor (options) {
    this.options = options

    this.tymlyDir = this.options.tymlyRootPath
    debug(`tymlyDir: `, this.tymlyDir)

    this.cardscriptSchemaPath = this.options.cardscriptSchemaPath
    debug(`cardscriptSchemaPath: `, this.cardscriptSchemaPath)

    this.pluginsRootDir = path.join(this.tymlyDir, 'plugins')
    debug(`pluginsRootDir: `, this.pluginsRootDir)

    this.corePluginPath = path.join(this.tymlyDir, 'packages', 'tymly-core', 'lib', 'plugin')
    debug(`corePluginPath: `, this.corePluginPath)

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

    const serviceDocsPath = path.join(servicePath, 'doc')
    const serviceName = path.basename(servicePath)

    service.name = serviceName
    service.nameCamel = camelCase(serviceName)
    service.pluginName = pluginName

    let docs
    try {
      docs = require(serviceDocsPath)
      if (!docs.description) {
        docs.description = NO_DESCRIPTION_TEXT
      }
    } catch (e) {
      docs = {
        description: NO_DESCRIPTION_TEXT
      }
    }
    service.docs = docs

    service.apiDocs = await this.generateDocumentation(
      path.join(servicePath, 'index.js'),
      {
        subjectName: serviceName,
        pluginName
      },
      messages
    )

    try {
      const indexPath = path.join(servicePath, 'index.js')
      const data = require(indexPath)
      service.schema = data.schema || 'Service Schema not found'
      service.bootBefore = data.bootBefore || 'Boot before property not found'
      service.bootAfter = data.bootAfter || 'Boot after property not found'
      service.refProperties = data.refProperties || 'Ref properties not found'
    } catch (e) {
      messages.push(`Problem getting main index.js file for service: ${serviceName} in ${pluginName}, does it have an index file?`)
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
    let fullPath = pluginPath
    if (pluginName !== 'tymly-core-plugin') {
      fullPath = path.join(fullPath, 'lib')
    }
    fullPath = path.join(fullPath, 'components', 'services', '*')
    const servicePath = await glob(fullPath)
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
    const stateResourceDocPath = path.join(stateResourcePath, 'doc')
    const stateResourceName = path.basename(stateResourcePath)

    stateResource.name = stateResourceName
    stateResource.nameCamel = camelCase(stateResourceName)
    stateResource.pluginName = pluginName

    let docs
    try {
      docs = require(stateResourceDocPath)
      if (!docs.description) {
        docs.description = NO_DESCRIPTION_TEXT
      }
    } catch (e) {
      docs = {
        description: NO_DESCRIPTION_TEXT
      }
    }
    stateResource.docs = docs

    // try {
    //   const indexPath = path.join(stateResourcePath, 'index.js')
    //   const data = require(indexPath)
    // } catch (e) {
    //   messages.push(`Problem getting main index.js file for state-resource: ${stateResourceName} in ${pluginName}, does it have an index file?`)
    //   debug(`Problem getting main index.js file for ${stateResourcePath}, does it have an index file?`)
    // }

    try {
      const schemaPath = path.join(stateResourcePath, 'schema.json')
      const schema = require(schemaPath)
      stateResource.schema = schema || {}
    } catch (e) {
      messages.push(`Problem getting schema.json file for state-resource: ${stateResourceName} in ${pluginName}.`)
      debug(`Problem getting schema.json file for ${stateResourcePath}, does it have an index file?`)
      stateResource.schema = {}
    }

    stateResource.apiDocs = await this.generateDocumentation(
      path.join(stateResourcePath, 'index.js'),
      {
        subjectName: stateResourceName,
        pluginName
      },
      messages
    )
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

    let fullPath = pluginPath
    if (pluginName !== 'tymly-core-plugin') {
      fullPath = path.join(fullPath, 'lib')
    }
    fullPath = path.join(fullPath, 'components', 'state-resources', '*')

    const stateResourcePath = await glob(fullPath)
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
      plugins: {},
      cardscriptComponents: {}
    }

    // TODO: loop over dirs in this.pluginsRootDir and push a plugin object onto this.collected.plugins
    // Worth debug(name and version) as we go.
    const pluginsToCheck = await glob(path.join(this.pluginsRootDir, '*'))
    pluginsToCheck.push(this.corePluginPath)

    pluginsToCheck.forEach(
      (pluginPath) => {
        debug(`Going to check ${pluginPath}`)
      }
    )

    for (const pluginPath of pluginsToCheck) {
      debug(`Plugin Name: ${path.basename(pluginPath)}`)
      const packageJson = await this.getPluginPackageJson(pluginPath)
      let pluginName = packageJson.name
      pluginName = pluginName.split('/').pop() // Get rid of "@wmfs/", if defined
      this.collected.plugins[pluginName] = {
        'name': pluginName,
        'nameCamel': camelCase(path.basename(pluginPath)),
        'packageJson': packageJson,
        'version': await this.getPluginVersion(packageJson),
        'services':
          await this.getPluginServices(pluginName, pluginPath, this.collectionMessages),
        'stateResources':
          await this.getPluginStateResources(pluginName, pluginPath, this.collectionMessages)
      }
    }
    // TODO: Add info about Cardscript components
    // cardscriptSummary: await this.getCardscriptSummary()

    return this.collected
  }

  async generateDocumentation (indexPath, options, messages) {
    debug(`Generating docs for ${options.subjectName} within ${options.pluginName}`)
    // Assume options.outputFile=blah.md
    // Assume options.outputDirPath=c:\blah
    return documentation.build(
      indexPath,
      {}
    )
      .then(documentation.formats.md)
      .then(output => {
        // if (!fs.existsSync(options.outputDirPath)) {
        //   fs.mkdirSync(options.outputDirPath)
        // }
        // fs.writeFileSync(path.join(options.outputDirPath, options.outputFile), output)
        if (output === '<!-- Generated by documentation.js. Update this documentation by updating the source code. -->\r\n') {
          messages.push(`${options.subjectName} in ${options.pluginName} does not contain any JSDocs`)
          debug(`${options.subjectName} in ${options.pluginName} does not contain any JSDocs`)
          output += '\r\n No JSDocs were found :('
        }
        return output
      })
  }

  // =====================================================================
  // METHODS USED TO GET STUFF ON THE COLLECTED DATA (i.e. this.collected)
  // =====================================================================

  getPluginList () {
    let pluginsArray = Object.values(this.collected.plugins)
    return orderBy(pluginsArray, ['name'], ['asc'])
  }

  getPlugin (options) {
    return this.collected.plugins[options.pluginName]
  }

  getServiceList (options) {
    const serviceList = []
    for (const [pluginName, plugin] of Object.entries(this.collected.plugins)) {
      if (!options.hasOwnProperty('pluginName') || pluginName === options.pluginName) {
        if (plugin.hasOwnProperty('services')) {
          plugin.services.forEach(
            (service) => {
              serviceList.push(
                service
              )
            }
          )
        }
      }
    }
    return orderBy(serviceList, ['name'], ['asc'])
  }

  getBlueprintDirsList (options) {
    const blueprintDirs = []
    for (const [pluginName, plugin] of Object.entries(this.collected.plugins)) {
      if (!options.hasOwnProperty('pluginName') || plugin.name === options.pluginName) {
        if (plugin.hasOwnProperty('services')) {
          plugin.services.forEach(
            (service) => {
              if (!options.hasOwnProperty('serviceName') || service.name === options.serviceName) {
                if (service.hasOwnProperty('docs') && service.docs.hasOwnProperty('blueprintDirs')) {
                  for (const [dirName, description] of Object.entries(service.docs.blueprintDirs)) {
                    blueprintDirs.push(
                      {
                        dirName: dirName,
                        description: description,
                        serviceName: service.name,
                        pluginName: pluginName
                      }
                    )
                  }
                }
              }
            }
          )
        }
      }
    }
    return orderBy(blueprintDirs, ['dirName'], ['asc'])
  }

  getStateResourceList (options) {
    const stateResourceList = []
    for (const [pluginName, plugin] of Object.entries(this.collected.plugins)) {
      if (!options.hasOwnProperty('pluginName') || pluginName === options.pluginName) {
        if (plugin.hasOwnProperty('stateResources')) {
          plugin.stateResources.forEach(
            (stateResource) => {
              stateResourceList.push(
                stateResource
              )
            }
          )
        }
      }
    }
    return orderBy(stateResourceList, ['name'], ['asc'])
  }

  writeToFile (options) {
    // Assume options.outputFilePath=c:\blah\gathered-info.json
    fs.writeFileSync(options.outputFilePath, JSON.stringify(this.collected, null, 2))
  }

  readFromFile (options) {
    // Assume options.gatheredInfoFilePath=c:\blah\gathered-info.json
    const s = fs.readFileSync(options.gatheredInfoFilePath)
    this.collected = JSON.parse(s.toString())
  }
}
