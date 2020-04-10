import Configure from './configure.js';
import Element from './element.js';
import * as controller from './controller.js';

var model = (id, element) => ({
  id,
  element,
  feedback: {
    correct: {
      type: 'custom',
      custom: 'correct-o'
    },
    incorrect: {
      type: 'custom',
      custom: 'custom feedback'
    },
    partial: {
      type: 'custom',
      custom: 'foo'
    }
  },
  correctResponses: {
    values: ['mutt', 'hound'],
    ignoreWhitespace: true,
    ignoreCase: false
  },
  partialResponses: {
    values: ['mutty'],
    ignoreWhitespace: true,
    ignoreCase: true,
    awardPercentage: '50'
  },
  answerBlankSize: '10',
  answerAlignment: 'left',
  prompt: 'Question Prompt goes here',
  allowDecimal: true,
  allowIntegersOnly: false,
  allowThousandsSeparator: true
});

var generate = {
	model: model
};

const { model: model$1 } = generate;

var config = {
  elements: {
    'text-entry': '../..'
  },
  models: [model$1('1', 'text-entry')]
};

//Note: demo-el is a custom element loaded in the markup.
      customElements.whenDefined('demo-el').then(() => {
        config.models.forEach(m => {
          const de = document.createElement('demo-el');
          document.body.appendChild(de);
          de.def = { tagName: m.element, Element, Configure, controller };
          de.model = m;
        });
      });
