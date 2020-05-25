# define-messages.macro

[![test](https://img.shields.io/github/workflow/status/ttypic/define-messages.macro/Test?label=tests&style=flat-square)](https://github.com/ttypic/define-messages.macro/actions)
[![coverage-status](https://img.shields.io/codecov/c/github/ttypic/define-messages.macro.svg?style=flat-square)](https://codecov.io/gh/ttypic/define-messages.macro)
[![npm](https://img.shields.io/npm/v/define-messages.macro.svg?style=flat-square)](https://www.npmjs.com/package/define-messages.macro)
[![npm-downloads](https://img.shields.io/npm/dw/define-messages.macro.svg?style=flat-square)](https://www.npmjs.com/package/define-messages.macro)

Babel macro which generates id for [React Intl](https://formatjs.io/docs/react-intl) messages automatically.
This project was inspired by [babel-plugin-react-intl-auto](https://github.com/akameco/babel-plugin-react-intl-auto#readme),
but it generates id for react-intl messages more explicitly and works with zero-config projects such as
[Create React App](https://github.com/facebook/create-react-app)

## Installation

If you use **Create React App** or have installed babel-plugin-macros skip babel plugin setup step

### Setup Babel Macros Plugin

```shell script
npm install --save-dev babel-plugin-macros
```

and add in `.babelrc`:

```json
{
  "plugins": ["macros"]
}
```

### Install define-messages.macro

Just install `define-messages.macro` with `npm` or `yarn`

```shell script
npm install --save-dev define-messages.macro
```

That’s it!

## Basic Usage

-   `import defineMessages from 'define-messages.macro'`
-   (optional) setup id unique prefix for file using `setupPrefix` method
-   define messages
-   (optional) update translations files using [react-intl-cli](https://github.com/ttypic/react-intl-cli)

```js
import defineMessages from 'define-messages.macro';

defineMessages.setupPrefix('components.some-component');

const messages = defineMessages({
    greeting: 'hello',
    goodbye: 'goodbye'
});
```

this code will be transformed to:

```js
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    greeting: {
        id: 'components.some-component.greeting',
        defaultMessage: 'hello'
    },
    goodbye: {
        id: 'components.some-component.goodbye',
        defaultMessage: 'goodbye'
    }
});
```

in `NODE_ENV !== 'production'` environment

and to:

```js
const messages = {
    greeting: {
        id: 'components.some-component.greeting',
        defaultMessage: 'hello'
    },
    goodbye: {
        id: 'components.some-component.goodbye',
        defaultMessage: 'goodbye'
    }
};
```

in `NODE_ENV === 'production'` environment

## More Examples

### Without `setupPrefix` method

You can use `define-messages.macro` without setting up prefix for id manually:

```js
// file: component/some-component/messages.js
import defineMessages from 'define-messages.macro';

const messages = defineMessages({
    greeting: 'hello',
    goodbye: 'goodbye'
});

//     ↓ ↓ ↓ ↓ ↓ ↓

const messages = defineMessages({
    greeting: 'component.some-component.hello',
    goodbye: 'component.some-component.goodbye'
});
```

### Define description field

You could define `description` field for your message:

```js
import defineMessages from 'define-messages.macro';

defineMessages.setupPrefix('components.some-component');

const messages = defineMessages({
    greeting: {
        defaultMessage: 'hello',
        description: 'Some description'
    }
});
```

will be transformed to:

```js
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    greeting: {
        id: 'components.some-component.greeting',
        defaultMessage: 'hello',
        description: 'Some description'
    }
});
```

### Define id for message

You could define `id` for some of your message and it won't be override:

```js
import defineMessages from 'define-messages.macro';

defineMessages.setupPrefix('components.some-component');

const messages = defineMessages({
    greeting: {
        id: 'my-existing-id',
        defaultMessage: 'hello',
        description: 'Some description'
    }
});
```

will be transformed to:

```js
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    greeting: {
        id: 'my-existing-id',
        defaultMessage: 'hello',
        description: 'Some description'
    }
});
```

## Configuration 

[babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros#readme) uses 
[cosmiconfig](https://github.com/davidtheclark/cosmiconfig#readme) to read a babel-plugin-macros configuration
which can be located in any of the following files up the directories from the importing file:

* `.babel-plugin-macrosrc`
* `.babel-plugin-macrosrc.json`
* `.babel-plugin-macrosrc.yaml`
* `.babel-plugin-macrosrc.yml`
* `.babel-plugin-macrosrc.js`
* `babel-plugin-macros.config.js`
* `babelMacros` in `package.json`

You can then specify plugin options in `defineMessages` entry:

* `relativeTo` - allows you to specify the directory that is used when determining a file's prefix

```js
// babel-plugin-macros.config.js
module.exports = {
    // ...
    // Other macros config
    defineMessages: {
        relativeTo: 'src' // by default path is babel work directory 
    }
}
```

## License

This package is licensed under MIT license.
