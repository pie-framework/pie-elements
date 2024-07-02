exports.model = (id, element) => ({
  "visibleToStudent": true,
  "halfScoring": false,
  "pointLabels": true,
  "description": false,
  "standards": false,
  "scales": [
    {
      "maxPoints": 4,
      "scorePointsLabels": [
        "<div>Non-Scorable</div>",
        "<div>Developing</div>",
        "<div>Progressing</div>",
        "<div>Effective</div>"
      ],
      "traitLabel": "Trait",
      "traits": [
        {
          "name": "<div>Ideas</div>",
          "standards": [],
          "description": "the main message",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>Topic undefined and/or difficult to followDetails are unclear</div>",
            "<div>Topic too broadDetails are limited</div>",
            "<div>Writing stays on topicComplete details given</div>"
          ]
        },
        {
          "name": "<div>Organization</div>",
          "standards": [],
          "description": "the internal structure of the piece",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>Does not have a beginning, middle and/or endDoes not have a lead and/or conclusionTransitions confusing and/or not presentNot written in logical orderNo sign of paragraphing / incorrect paragraphing</div>",
            "<div>Weak beginning, middle and endHas evidence of a lead and/or conclusion but missing elementsTransitions are used sometimesSome logical orderMost paragraphing incorrect</div>",
            "<div>Has an acceptable beginning, middle and endIncludes a lead and conclusionTransitions are used correctlyMostly logical orderMostly correct paragraphing</div>"
          ]
        },
        {
          "name": "<div>Word Choice</div>",
          "standards": [],
          "description": "the vocabulary a writer chooses to convey meaning",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>Vocabulary is limited/used incorrectlyNo figurative language; words do not convey meaning</div>",
            "<div>Generally correct wordsAttempt at figurative languageand/or words convey general meaning</div>",
            "<div>Some active verbs and precise nounsEffective use of figurative language and/or words that enhance meaning</div>"
          ]
        },
        {
          "name": "<div>Sentence Fluency</div>",
          "standards": [],
          "description": "the rhythm and flow of the language",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>No sentences are clearNo variety in sentence structureFrequent run-ons and/or fragments are present</div>",
            "<div>Some sentences are clearSentence variety used rarelySome run-ons and/or fragments are present</div>",
            "<div>Most sentences are clearSome sentence variety is usedRun-ons and/or fragments are rare</div>"
          ]
        },
        {
          "name": "<div>Conventions</div>",
          "standards": [],
          "description": "the mechanical correctness",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>Many distracting errors are present in grammar, punctuation, capitalization and/or spelling</div>",
            "<div>Errors in grammar, punctuation, capitalization and/or spelling are present and some distract from meaning</div>",
            "<div>Errors in grammar, punctuation, capitalization and/or spelling are present but don’t distract from meaning</div>"
          ]
        },
        {
          "name": "<div>Voice</div>",
          "standards": [],
          "description": "the personal tone and flavor of the author's message",
          "scorePointsDescriptors": [
            "<div>Student’s response is blank, not in English, not legible, or does not respond to the prompt.</div>",
            "<div>Not concerned with audience or purposeNo viewpoint (perspective) usedWriting is mechanical and lifeless</div>",
            "<div>Shows beginning awareness of audience/purposeSome viewpoint (perspective) used throughout the pieceWriting is distant, too formal or informal</div>",
            "<div>Awareness of audience; purpose is clear most of the timeUses viewpoint (perspective) throughout most of the paperWriting is pleasant, agreeable and satisfying</div>"
          ]
        }
      ]
    },
    {
      "maxPoints": 5,
      "scorePointsLabels": [
        "<div>Non-Scorable</div>",
        "<div>Unsatisfactory</div>",
        "<div>Satisfactory</div>",
        "<div></div>",
        "<div></div>"
      ],
      "traitLabel": "Category",
      "traits": [
        {
          "name": "<div>Presentation</div>",
          "standards": [],
          "description": "",
          "scorePointsDescriptors": [
            "<div>Handwriting is unreadable, or response is blank, not in English, or too brief to evaluate. </div>",
            "<div>Handwriting poorOverall appearance is distracting to unacceptable</div>",
            "<div>Handwriting is generally legibleOverall appearance is acceptable or better</div>",
            "<div></div>",
            "<div></div>"
          ]
        }
      ]
    }
  ],
  "excludeZero": true,
  "maxPointsEnabled": true,
  "addScaleEnabled": true,
  id,
  element
});
