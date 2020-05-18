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
-   setup id unique prefix for file using `setupPrefix` method
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

## Why should I setup prefix manually?

In my opinion it's better to explicitly setup prefix for your ids instead of generate them automatically based on
file path like in [babel-plugin-react-intl-auto](https://github.com/akameco/babel-plugin-react-intl-auto#readme).
The main problem with auto ids that even small refactoring could break translations
(e.g. you want to rename file with messages or move it). But option to implicitly generate prefix could be added in
future releases.

## License

This package is licensed under MIT license.
