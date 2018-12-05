const glob = require('glob-promise')
const fs = require('fs')
const path = require('path')
const dottie = require('dottie')

const tymlyPath = process.env.TYMLY_PATH

async function main () {
  const plugins = {}
  const stateResources = {}

  const pluginsPath = path.join(tymlyPath, 'plugins', '*')
  const pluginDirPaths = await glob(pluginsPath)
  for (const p of pluginDirPaths) {
    const name = p.split('/').pop()
    const stateResourcesPath = path.join(p, 'lib', 'components', 'state-resources', '*')
    const stateResourcesList = await glob(stateResourcesPath)
    for (const resource of stateResourcesList) {
      try {
        const docsPath = fs.readdirSync(path.join(resource, 'doc'))
        let doc
        // console.log('searching this path; ', resource, docsPath)
        for (const file of docsPath) {
          // console.log('reading in: ', path.join(resource, 'doc', file))
          const fileType = file.split('.')[1]
          if (fileType === 'js') doc = require(path.join(resource, 'doc', file))
          else if (fileType === 'json') doc = JSON.parse(fs.readFileSync(path.join(resource, 'doc', file)))
          // console.log('got this file: ', file, doc)
          for (const resource of stateResourcesList) {
            const resourceName = resource.split('/').pop()
            console.log(`Inside ${name} ${resourceName} we have ${Object.entries(doc)}`)
            // resource.split('/').pop()
            dottie.set(plugins, `${name}.state-resources.${resourceName}`, {
              description: doc.description || 'No description provided',
              example: doc.example || 'No example provided'
            })

            // plugins[name]['state-resources'][resourceName] = {
            //   description: doc.description || 'No description provided',
            //   example: doc.example || 'No example provided'
            // }
          }
        }
      } catch (e) {
        console.error(`${resource} is lacking a docs file, tut tut! \n------------------\n ${e} \n\n`)
      }
    }
  }

  console.log(JSON.stringify(plugins, null, 2))
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
