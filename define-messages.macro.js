const { createMacro, MacroError } = require('babel-plugin-macros');
const { addNamed } = require('@babel/helper-module-imports');

const path = require('path');

const findPrefix = members => {
    if (members.length !== 1) {
        throw new MacroError('define-messages.macro: you shouldn`t setup more than one file prefix');
    }

    const memberPath = members[0].parentPath;

    if (memberPath.node.property.name !== 'setupPrefix') {
        throw new MacroError('define-messages.macro: `defineMessage` has one only `setupPrefix` method');
    }

    return memberPath.parentPath.get('arguments')[0].evaluate().value;
};

const buildDefaultPrefix = ({ filename, config }) => {
    const { relativeTo = process.cwd() } = config;
    const relativeDirs = path.relative(relativeTo, path.dirname(filename)).split(path.sep);
    return relativeDirs.join('.');
};

const addId = ({ prop, prefix, t }) => {
    const { key, value } = prop;
    const { type: valueType } = value;
    const { name: keyName } = key;

    if (valueType === 'StringLiteral') {
        const defaultMessageProperty = t.objectProperty(t.identifier('defaultMessage'), value);
        const idProperty = t.objectProperty(t.identifier('id'), t.stringLiteral(`${prefix}.${keyName}`));
        prop.value = t.objectExpression([idProperty, defaultMessageProperty]);
    } else if (valueType === 'ObjectExpression') {
        const properties = value.properties;
        if (properties.some(p => p.key.name === 'id')) return;
        const idProperty = t.objectProperty(t.identifier('id'), t.stringLiteral(`${prefix}.${keyName}`));
        properties.unshift(idProperty);
    } else {
        throw new MacroError('define-messages.macro: `defineMessages` has wrong argument');
    }
};

const replaceMessagesArgument = ({ callPath, prefix, t }) => {
    const callArguments = callPath.get('arguments');

    if (callArguments.length !== 1) {
        throw new MacroError('define-messages.macro: `defineMessage` should have exact one argument');
    }

    if (callArguments[0].type !== 'ObjectExpression') {
        throw new MacroError('define-messages.macro: `defineMessage` should have object argument');
    }

    const props = callArguments[0].node.properties;

    props.forEach(prop => addId({ prop, prefix, t }));
};

const defineMessagesMacro = ({ references, state, babel, config }) => {
    const { types: t } = babel;
    const { path: program, opts } = state.file;

    const filename = opts.filename;

    const calls = references.default.filter(referencePath => referencePath.parentPath.type === 'CallExpression');
    const members = references.default.filter(referencePath => referencePath.parentPath.type === 'MemberExpression');

    const prefix = members.length === 0 ? buildDefaultPrefix({ filename, config }) : findPrefix(members);
    members.forEach(referencePath => referencePath.getStatementParent().remove());

    if (process.env.NODE_ENV === 'production') {
        // remove defineMessages call is production
        calls.forEach(referencePath => {
            const callPath = referencePath.parentPath;
            replaceMessagesArgument({ callPath, prefix, t });
            callPath.replaceWith(callPath.get('arguments')[0]);
        });
    } else {
        // add react-intl import if NODE_ENV is not production
        const refName = 'defineMessages';
        const id = addNamed(program, refName, 'react-intl', { nameHint: refName });

        calls.forEach(referencePath => {
            referencePath.node.name = id.name;
            const callPath = referencePath.parentPath;
            replaceMessagesArgument({ callPath, prefix, t });
        });
    }
};

module.exports = createMacro(defineMessagesMacro, {
    configName: 'defineMessages'
});
