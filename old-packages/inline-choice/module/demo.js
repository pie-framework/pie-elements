import Configure from './configure.js';
import Element from './element.js';
import * as controller from './controller.js';

var model = (id, element) => ({
  id,
  element,

  defaultLang: 'en-US',
  choiceLabel: 'Select option ...',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden'
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'default'
      }
    },
    {
      value: 'norway',
      label: 'Norway'
    },
    {
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'custom',
        value: 'Nokia was founded in Finland.'
      }
    }
  ]
});

var generate = {
	model: model
};

const { model: model$1 } = generate;

var config = {
  elements: {
    'inline-choice': '../..'
  },
  models: [model$1('1', 'inline-choice')]
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
