module.exports = {
    elements: {
        'likert-choice': '../..'
    },
    models: [
        {
            id: '1',
            element: 'likert-choice',
            prompt: 'Do you Like northern European countries ?',
            choiceMode: 'radio',
            keyMode: 'numbers',
            activeLang: 'en-US',
            defaultLang: 'en-US',
            disabled: false,
            choices: [
                {
                    correct: true,
                    value: 'disagree',
                    label: [
                        {lang: 'en-US', value: 'Disagree'},
                        {lang: 'es-ES', value: 'Discrepar'}
                    ],
                },
                {
                    correct: true,
                    value: 'neutral',
                    label: [
                        {lang: 'en-US', value: 'Neutral'},
                        {lang: 'es-ES', value: 'Neutral'}
                    ],
                },
                {
                    value: 'agree',
                    label: [
                        {lang: 'en-US', value: 'Agree'},
                        {lang: 'es-ES', value: 'De Acuerdo'}
                    ],
                }
            ]
        }
    ]
}