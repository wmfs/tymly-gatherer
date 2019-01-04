# [1.1.0](https://github.com/wmfs/tymly-gatherer/compare/v1.0.2...v1.1.0) (2019-01-04)


### ✨ Features

* getPluginPackageJson implementation ([f3f33dc](https://github.com/wmfs/tymly-gatherer/commit/f3f33dc))
* implementation for getPluginServices ([7f22588](https://github.com/wmfs/tymly-gatherer/commit/7f22588))
* start implementation for collect function ([2d643d0](https://github.com/wmfs/tymly-gatherer/commit/2d643d0))


### 🐛 Bug Fixes

* all the standard fixes ever ([fa663aa](https://github.com/wmfs/tymly-gatherer/commit/fa663aa))
* final standard fix I promise p.s. can you tell my linter isn't working? ([ccb9f4b](https://github.com/wmfs/tymly-gatherer/commit/ccb9f4b))
* standard changes [#2](https://github.com/wmfs/tymly-gatherer/issues/2) ([c663955](https://github.com/wmfs/tymly-gatherer/commit/c663955))
* switch pluginVersionSource to local for tests ([c374974](https://github.com/wmfs/tymly-gatherer/commit/c374974))


### 🛠 Builds

* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([bd05282](https://github.com/wmfs/tymly-gatherer/commit/bd05282))


### 📦 Code Refactoring

* refactor for getting package.json & implementation for getting version from local package.json ([4450cf8](https://github.com/wmfs/tymly-gatherer/commit/4450cf8))
* rename plugins -> pluginPaths && plugins -> pluginDirPaths to clarify that these are paths ([3483834](https://github.com/wmfs/tymly-gatherer/commit/3483834))
* replace functionality containing '.split('/')' to use path.basename to avoid OS issues ([69bf4b7](https://github.com/wmfs/tymly-gatherer/commit/69bf4b7))


### 📚 Documentation

* README update ([1018ebb](https://github.com/wmfs/tymly-gatherer/commit/1018ebb))


### ♻️ Chores

* update package.json with mock version ([b886881](https://github.com/wmfs/tymly-gatherer/commit/b886881))

## [1.0.2](https://github.com/wmfs/tymly-gatherer/compare/v1.0.1...v1.0.2) (2018-12-19)


### 🐛 Bug Fixes

* force build ([a2f3c36](https://github.com/wmfs/tymly-gatherer/commit/a2f3c36))

## [1.0.1](https://github.com/wmfs/tymly-gatherer/compare/v1.0.0...v1.0.1) (2018-12-19)


### 🐛 Bug Fixes

* update semantic-release version ([5d5f003](https://github.com/wmfs/tymly-gatherer/commit/5d5f003))

# 1.0.0 (2018-12-19)


### ✨ Features

* accommodate for many plugins rather than just one ([c45c565](https://github.com/wmfs/tymly-gatherer/commit/c45c565))
* funnel output into output.txt file ([9be1eae](https://github.com/wmfs/tymly-gatherer/commit/9be1eae))
* implementation for selective doc harvesting and big refactor ([ef01d66](https://github.com/wmfs/tymly-gatherer/commit/ef01d66))
* initial implementation for grabbing doc-y data from state resources ([13b10be](https://github.com/wmfs/tymly-gatherer/commit/13b10be))
* separate out listStateResourceSummary and listServiceSummary ([9494070](https://github.com/wmfs/tymly-gatherer/commit/9494070))


### 🐛 Bug Fixes

* Add the actual gatherer class too (oops) ([78c363d](https://github.com/wmfs/tymly-gatherer/commit/78c363d))
* attach description onto description instead of index ([2accbe5](https://github.com/wmfs/tymly-gatherer/commit/2accbe5))
* default stateResources and services to empty object instead of string ([49258c8](https://github.com/wmfs/tymly-gatherer/commit/49258c8))
* modification of where we put services and some error handling ([689c61b](https://github.com/wmfs/tymly-gatherer/commit/689c61b))
* now gets correct doc/examples rather than overwriting ([83f23f7](https://github.com/wmfs/tymly-gatherer/commit/83f23f7))
* refactor into class-based approach and start of tests ([529a9b4](https://github.com/wmfs/tymly-gatherer/commit/529a9b4))
* remove old index.js file and rename tymly-gatherer class to index ([b09a46c](https://github.com/wmfs/tymly-gatherer/commit/b09a46c))
* resolve the paths so we can use relative stuff ([df2c000](https://github.com/wmfs/tymly-gatherer/commit/df2c000))
* standard fixes ([4658c51](https://github.com/wmfs/tymly-gatherer/commit/4658c51))
* standard fixes ([a08d850](https://github.com/wmfs/tymly-gatherer/commit/a08d850))


### 🛠 Builds

* remove GitHub actions config ([82a2d55](https://github.com/wmfs/tymly-gatherer/commit/82a2d55))
* update package.json to use semantic-release during build, versioning and publishing of package ([b076c92](https://github.com/wmfs/tymly-gatherer/commit/b076c92))
* **deps-dev:** add packages for doing the things ([1c39cf8](https://github.com/wmfs/tymly-gatherer/commit/1c39cf8))


### 📚 Documentation

* add badges ([92f257b](https://github.com/wmfs/tymly-gatherer/commit/92f257b))
* add changelog ([d79baa8](https://github.com/wmfs/tymly-gatherer/commit/d79baa8))


### 🚨 Tests

* add tests for stateResourceSummary & serviceSummary functions ([226580a](https://github.com/wmfs/tymly-gatherer/commit/226580a))
* check for services in tests too ([e25d664](https://github.com/wmfs/tymly-gatherer/commit/e25d664))
* param update to align with previous commit ([9874c04](https://github.com/wmfs/tymly-gatherer/commit/9874c04))


### ⚙️ Continuous Integrations

* **travis:** Update Travis config ([347febc](https://github.com/wmfs/tymly-gatherer/commit/347febc))
* add semantic release config ([f0a80df](https://github.com/wmfs/tymly-gatherer/commit/f0a80df))


### ♻️ Chores

* readme update ([608bec1](https://github.com/wmfs/tymly-gatherer/commit/608bec1))
* update .gitignore ([e5b8fff](https://github.com/wmfs/tymly-gatherer/commit/e5b8fff))
