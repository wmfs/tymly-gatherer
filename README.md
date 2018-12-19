# tymly-gatherer

[![Build Status](https://travis-ci.com/wmfs/tymly-gatherer.svg?token=nmm9if9qp6sBNJ5PjroH&branch=master)](https://travis-ci.com/wmfs/safe-and-well-blueprint)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly-gatherer/LICENSE)

> A package to collate and present the contents of a [Tymly](https://github.org/wmfs/tymly) shaped repo

Tymly-gatherer contains a class that exposes multiple methods which can be used to glean information about a _Tymly "shaped" repo_.

**_Tymly shaped repo_**: following the typical Tymly monorepo structure in regards to plugins \
The example below is based on the test/fixtures/plugins/simpsons-plugin, but many plugins are present in Tymly
```
 plugins/
 └── simpsons-plugin/
      └── lib/
           └── components/
                ├── services/
                │    ├── krusty-burger/
                │    │    └── doc
                │    │         └── index.js
                │    │
                │    ├── kwik-e-mart/
                │    │     └── doc
                │    │         └── index.js
                │    │
                │    └── moes-tavern/
                │          └── doc
                │              └── index.js
                │
                └── state-resources/
                     ├── eat-at-krusty-burger/
                     │    └── doc/
                     │        ├── example.json
                     │        └── index.js
                     │
                     ├── visit-apu-at-kwik-e-mart/
                     │    └── doc/
                     │        ├── example.json
                     │        └── index.js
                     │
                     └── drink-at-moes-tavern/
                          └── doc/
                              ├── example.json
                              └── index.js
```

**The methods exposed within the Gatherer class are as such:**

> These methods return lists containing what is specified in the title & params
```
* listPluginSummary()
* listStateResourceSummary(pluginsPath, target)
* listServiceSummary(pluginsPath, target)
```

> These methods return details surrounding what is specified in the title & params
```
getPluginDetail()
getStateResourceDetail()
getServiceDetail()
```


## <a name="install"></a> Install
```
$ npm install @wmfs/tymly-gatherer --save
```


## <a name='license'></a>License
[MIT](https://github.com/wmfs/tymly-gatherer/blob/master/LICENSE)
