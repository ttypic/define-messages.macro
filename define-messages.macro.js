const { createMacro, MacroError } = require('babel-plugin-macros');
const { addNamed } = require('@babel/helper-module-imports');

const findPrefix = memberPath => {
    if (memberPath.node.property.name !== 'setupPrefix') {
        throw new MacroError('define-messages.macro: defineMessage has one only setupPrefix method');
    }
    return memberPath.parentPath.get('arguments')[0].evaluate().value;
};

const addId = ({ prop, prefix, t }) => {
    const { key, value } = prop.node;
    const { type: valueType } = value;
    const { name: keyName } = key;

    if (valueType === 'StringLiteral') {
        const defaultMessageProperty = t.objectProperty(t.identifier('defaultMessage'), prop.node.value);
        const idProperty = t.objectProperty(t.identifier('id'), t.stringLiteral(`${prefix}.${keyName}`));
        prop.node.value = t.objectExpression([idProperty, defaultMessageProperty]);
    } else if (valueType === 'ObjectExpression') {
        const properties = value.properties;
        if (properties.some(p => p.key.name === 'id')) return;
        const idProperty = t.objectProperty(t.identifier('id'), t.stringLiteral(`${prefix}.${keyName}`));
        properties.unshift(idProperty);
    }
};

const replaceMessagesArgument = ({ callPath, prefix, t }) => {
    const callArguments = callPath.get('arguments');

    if (callArguments.length !== 1) {
        throw new MacroError('define-messages.macro: defineMessage should have exact one argument');
    }

    if (callArguments[0].type !== 'ObjectExpression') {
        throw new MacroError('define-messages.macro: defineMessage should have object argument');
    }

    const props = callArguments[0].get('properties');

    props.forEach(prop => addId({ prop, prefix, t }));
};

const defineMessagesMacro = ({ references, state, babel }) => {
    const { types: t } = babel;
    const { path: program } = state.file;

    const calls = references.default.filter(referencePath => referencePath.parentPath.type === 'CallExpression');
    const members = references.default.filter(referencePath => referencePath.parentPath.type === 'MemberExpression');

    if (members.length !== 1) {
        throw new MacroError('define-messages.macro: You should setup exact one file prefix');
    }

    const memberExpression = members[0].parentPath;
    const prefix = findPrefix(memberExpression);
    memberExpression.getStatementParent().remove();

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

module.exports = createMacro(defineMessagesMacro);
