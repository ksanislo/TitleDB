# admin-config [![Build Status](https://travis-ci.org/marmelab/admin-config.svg?branch=master)](https://travis-ci.org/marmelab/admin-config)

Common files used in both [ng-admin](https://github.com/marmelab/ng-admin) and [react-admin](https://github.com/marmelab/react-admin).

## Installation

```sh
make install
```

## Including In Another Library

Require whatever class you need directly.

```js
// es5
var NumberField = require('admin-config/lib/Field/NumberField');
// es6
import NumberField from "admin-config/lib/Field/NumberField";
```

Admin-config is written in ES6. You'll need a transpiler to use any of the classes (we recommend [Webpack](http://webpack.github.io/) and [babel](https://babeljs.io/)). Here is an example Webpack configuration:

```js
module.exports = {
    // ...
    module: {
        loaders: [
            { test: /node_modules\/admin-config\/.*\.js$/, loader: 'babel' }
        ]
    }
};
```

## Transpiling

In order to increase this library compatibility and to not force other users of this
library to use Babel, you need to transpile your ES6 code from `src/` to good old ES5
code (in `lib/`).

Just run:

``` sh
make transpile
```

And you are done!

## Running Tests

```sh
make test
```
