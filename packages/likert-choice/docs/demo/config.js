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
            activeLanguage: 'en-US',
            choices: [
                {
                    correct: true,
                    value: 'like',
                    label: [
                        {lang: 'en-US', value: 'Like'},
                        {lang: 'es-ES', value: 'Me gusta'}
                    ],
                },
                {
                    value: 'dislike',
                    label: [
                        {lang: 'en-US', value: 'Dislike'},
                        {lang: 'es-ES', value: 'Disgusto'}
                    ],
                },
                {
                    value: 'notLikely',
                    label: [
                        {lang: 'en-US', value: 'Dislike'},
                        {lang: 'es-ES', value: 'Disgusto'}
                    ],
                }
            ]
        }
    ]
}