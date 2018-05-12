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
            keyMode: 'letters',
            activeLang: 'en-US',
            defaultLang: 'en-US',
            disabled: false,
            choices: [
                {
                    correct: true,
                    value: 'disagree',
                    label: [
                        {lang: 'en-US', label: 'Disagree', value: 'Disagree'},
                        {lang: 'es-ES', label: 'Discrepar', value: 'Discrepar'}
                    ],
                },
                {
                    correct: true,
                    value: 'neutral',
                    label: [
                        {lang: 'en-US', label: 'Neutral', value: 'Neutral'},
                        {lang: 'es-ES', label: 'Neutral', value: 'Neutral'}
                    ],
                },
                {
                    value: 'agree',
                    label: [
                        {lang: 'en-US', label: 'Agree', value: 'Agree'},
                        {lang: 'es-ES', label: 'De Acuerdo', value: 'De Acuerdo'}
                    ],
                }
            ]
        }
    ]
}