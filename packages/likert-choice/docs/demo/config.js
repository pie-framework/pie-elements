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
      likert: '3',
      disabled: false,
      choices: [
        {lang: 'en-US', value: 'disagree', label: 'Disagree'},
        {lang: 'en-US', value: 'unsure', label: 'Unsure'},
        {lang: 'en-US', value: 'agree', label: 'Agree'}
      ],
      meta: {
        agreement: [
          {
            label: [
              {lang: 'en-US', value: 'extremely_disagree', label: 'Extremely Disagree'},
              {lang: 'es-ES', value: 'extremadamente_en_desacuerdo', label: 'Extremadamente en desacuerdo'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'strongly_disagree', label: 'Strongly Disagree'},
              {lang: 'es-ES', value: 'muy_en_desacuerdo', label: 'Muy En Desacuerdo'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'disagree', label: 'Disagree'},
              {lang: 'es-ES', value: 'discrepar', label: 'Discrepar'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'agree', label: 'Agree'},
              {lang: 'es-ES', value: 'deacuerdo', label: 'De Acuerdo'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'strongly_agree', label: 'Strongly Agree'},
              {lang: 'es-ES', value: 'totalmente_de_acuerdo', label: 'Totalmente de acuerdo'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'extremely_agree', label: 'Extremely Agree'},
              {lang: 'es-ES', value: 'extremadamente_de_acuerdo', label: 'Extremadamente de acuerdo'}
            ]
          }
        ],
        frequency: [
          {
            label: [
              {lang: 'en-US', value: 'never', label: 'Never'},
              {lang: 'es-ES', value: 'nunca', label: 'Nunca'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_infrequently', label: 'Very Infrequently'},
              {lang: 'es-ES', value: 'muy_infrecuentemente', label: 'Muy Infrecuentemente'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'infrequently', label: 'Infrequently'},
              {lang: 'es-ES', value: 'infrecuentemente', label: 'Infrecuentemente'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'frequently', label: 'Frequently'},
              {lang: 'es-ES', value: 'frecuentemente', label: 'Frecuentemente'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_frequently', label: 'Very Frequently'},
              {lang: 'es-ES', value: 'muy_frecuentemente', label: 'Muy Frecuentemente'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'always', label: 'Always'},
              {lang: 'es-ES', value: 'siempre', label: 'Siempre'}
            ]
          }
        ],
        yesno: [
          {
            label: [
              {lang: 'en-US', value: 'never', label: 'Never'},
              {lang: 'es-ES', value: 'nunca', label: 'Nunca'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'rarely', label: 'Rarely'},
              {lang: 'es-ES', value: 'raramente', label: 'Raramente'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'not_really', label: 'Not Really'},
              {lang: 'es-ES', value: 'realmente_no', label: 'Realmente No'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'sometimes', label: 'Sometimes'},
              {lang: 'es-ES', value: 'a_veces', label: 'A veces'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_often', label: 'Very Often'},
              {lang: 'es-ES', value: 'muy_a_menudo', label: 'Muy a menudo'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'always', label: 'Always'},
              {lang: 'es-ES', value: 'siempre', label: 'Siempre'}
            ]
          }
        ],
        likelihood: [
          {
            label: [
              {lang: 'en-US', value: 'extremely_unlikely', label: 'Extremely Unlikely'},
              {lang: 'es-ES', value: 'extremadamente_improbable', label: 'Extremadamente Improbable'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_unlikely', label: 'Very Unlikely'},
              {lang: 'es-ES', value: 'muy_poco_probable', label: 'Muy Poco Probable'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'not_likely', label: 'Not Likely'},
              {lang: 'es-ES', value: 'no_es_probable', label: 'No Es Probable'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'likely', label: 'Likely'},
              {lang: 'es-ES', value: 'probable', label: 'Probable'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_likely', label: 'Very Likely'},
              {lang: 'es-ES', value: 'muy_probable', label: 'Muy Probable'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'extremely_likely', label: 'Extremely Likely'},
              {lang: 'es-ES', value: 'extremadamente_probable', label: 'Extremadamente Probable'}
            ]
          }
        ],
        importance: [
          {
            label: [
              {lang: 'en-US', value: 'extremely_not_important', label: 'Extremely Not Important'},
              {lang: 'es-ES', value: 'extremadamente_no_importante', label: 'Extremadamente No Importante'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_not_important', label: 'Very Not Important'},
              {lang: 'es-ES', value: 'muy_no_importante', label: 'Muy No Importante'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'not_important', label: 'Not Important'},
              {lang: 'es-ES', value: 'no_importante', label: 'No Importante'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'important', label: 'Important'},
              {lang: 'es-ES', value: 'importante', label: 'Importante'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'very_important', label: 'Very Important'},
              {lang: 'es-ES', value: 'muy_importante', label: 'Muy Importante'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'extremely_important', label: 'Extremely Important'},
              {lang: 'es-ES', value: 'extremadamente_importante', label: 'Extremadamente Importante'}
            ]
          }
        ],
        likelihood: [
          {
            label: [
              {lang: 'en-US', value: 'extremely_dislike', label: 'Extremely Dislike'},
              {lang: 'es-ES', value: 'extremadamente_disgusto', label: 'Extremadamente Disgusto'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'really_dislike', label: 'Really Dislike'},
              {lang: 'es-ES', value: 'realmente_no_me_gusta', label: 'Realmente no me gusta'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'dislike', label: 'Dislike'},
              {lang: 'es-ES', value: 'disgusto', label: 'Disgusto'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'unsure', label: 'Unsure'},
              {lang: 'es-ES', value: 'inseguro', label: 'Inseguro'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'like', label: 'Like'},
              {lang: 'es-ES', value: 'me_gusta', label: 'Me Gusta'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'really_like', label: 'Really Like'},
              {lang: 'es-ES', value: 'realmente_como', label: 'Realmente Como'}
            ]
          },
          {
            label: [
              {lang: 'en-US', value: 'extremely_like', label: 'Extremely Like'},
              {lang: 'es-ES', value: 'extremadamente_como', label: 'Extremadamente Como'}
            ]
          }
        ]
      }
    }
  ]
}