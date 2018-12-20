# tymly-gatherer

[![Build Status](https://travis-ci.com/wmfs/tymly-gatherer.svg?token=nmm9if9qp6sBNJ5PjroH&branch=master)](https://travis-ci.com/wmfs/safe-and-well-blueprint)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly-gatherer/LICENSE)

> A package to collate and present the contents of a [Tymly](https://github.org/wmfs/tymly) shaped repo

# Installation

``` bash
npm install @wmfs/tymly-gatherer --save
```

## <a name="Usage"></a> Usage
```
const Gatherer = require('@wmfs/tymly-gatherer')

const meta = new Gatherer(
  {
    tymlyDir: 'c:/development/tymly',
    cardscriptSchemaPath: '/cardscript/packages/cardscript-schema/lib/schema.json',
    assetsOutputRootDir: '/temp',
    pluginVersionSource: 'npm'
  }
)
```


## Environment variables

| Env variable | Notes |
| -------------| ----- |
| `DEBUG`      | Set it to `tymly-gatherer` to see what's going on.


## <a name='license'></a>License
[MIT](https://github.com/wmfs/tymly-gatherer/blob/master/LICENSE)
