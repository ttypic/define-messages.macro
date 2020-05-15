const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const Macros = require('babel-plugin-macros');

pluginTester({
    plugin: Macros,
    snapshot: false,
    tests: {
        'it replaces import in development': {
            fixture: path.join(__dirname, 'fixtures/replace-import/code.js'),
            outputFixture: path.join(__dirname, 'fixtures/replace-import/output.js'),
            setup: () => {
                process.env.NODE_ENV = 'development';
            }
        },
        'it removes import in production': {
            fixture: path.join(__dirname, 'fixtures/remove-import/code.js'),
            outputFixture: path.join(__dirname, 'fixtures/remove-import/output.js'),
            setup: () => {
                process.env.NODE_ENV = 'production';
            }
        },
        "it doesn't add id prop if it already exists": {
            fixture: path.join(__dirname, 'fixtures/do-not-replace-id-if-exists/code.js'),
            outputFixture: path.join(__dirname, 'fixtures/do-not-replace-id-if-exists/output.js'),
            setup: () => {
                process.env.NODE_ENV = 'development';
            }
        },
        'it add id prop for object messages': {
            fixture: path.join(__dirname, 'fixtures/add-id-to-object/code.js'),
            outputFixture: path.join(__dirname, 'fixtures/add-id-to-object/output.js'),
            setup: () => {
                process.env.NODE_ENV = 'production';
            }
        }
    }
});
