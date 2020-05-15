import defineMessages from '../../define-messages.macro';

defineMessages.setupPrefix('components.some-component');

const messages = defineMessages({
    greeting: {
        id: 'some.hardcoded.id',
        defaultMessage: 'hello'
    },
    goodbye: 'goodbye'
});
