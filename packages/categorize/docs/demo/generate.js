const E234 = {
  choicesPosition: 'below',
  lockChoiceOrder: false,
  choices: [
    {
      content: 'built on board',
      id: '0',
      categoryCount: 1,
    },
    {
      content: 'shipped from Earth',
      id: '1',
      categoryCount: 1,
    },
    {
      id: '2',
      categoryCount: 1,
      content: 'carried on board',
    },
    {
      categoryCount: 1,
      content: 'rebuilt when lost or broken',
      id: '3',
    },
  ],
  categories: [
    {
      id: '0',
      label: 'Traditional Equipment',
    },
    {
      id: '1',
      label: '3D-Printed Equipment',
    },
  ],
  categoriesPerRow: 2,
  rationale:
    '<p>Traditional equipment must be carried on board or shipped from Earth. 3D-printed equipment can be built on demand or rebuilt if it gets lost or broken.</p>',
  prompt:
    '<p>Drag <span class="relative-emphasis">two</span> phrases into each of the categories.</p>',
  partialScoring: true,
  correctResponse: [
    {
      choices: ['1', '2'],
      category: '0',
    },
    {
      choices: ['0', '3'],
      category: '1',
    },
  ],
};
// const E236 = {
//   choices: [
//     {
//       id: '0',
//       categoryCount: 1,
//       content: '3 pizzas cost $30.75',
//     },
//     {
//       categoryCount: 1,
//       content: '4 pizzas cost $39.00',
//       id: '1',
//     },
//     {
//       categoryCount: 1,
//       content: '5 pizzas cost $57.50',
//       id: '2',
//     },
//     {
//       categoryCount: 1,
//       content: '6 pizzas cost $69.00',
//       id: '3',
//     },
//     {
//       id: '4',
//       categoryCount: 1,
//       content: '7 pizzas cost $71.75',
//     },
//     {
//       content: '8 pizzas cost $78.00',
//       id: '5',
//       categoryCount: 1,
//     },
//   ],
//   categories: [
//     {
//       id: '0',
//       label: 'Roma',
//     },
//     {
//       id: '1',
//       label: 'Pizza Plus',
//     },
//     {
//       id: '2',
//       label: 'Umberto\'s',
//     },
//   ],
//   categoriesPerRow: 3,
//   rationale:
//     '<p>Find the unit price for each bill&#160;by dividing the total charged by the number of pizzas ordered.</p><p>3 pizzas for $30.75 is a unit price of $30.75/3 = $10.25 - Roma</p><p>4 pizzas for $39.00 is a unit price of $39.00/4 = $9.75 - Umberto&#39;s</p><p>5 pizzas for $57.50 is a unit price of $57.50/5 = $11.50 - Pizza Plus</p><p>6 pizzas for $69.00 is a unit price of $69.00/6 = $11.50 - Pizza Plus</p><p>7 pizzas for $71.75 is a unit price of $71.75/7 = $10.25 - Roma</p><p>8 pizzas for $78.00 is a unit price of $78.00/8 = $9.75 - Umberto&#39;s</p><p></p>',
//   prompt:
//     '<p>The prices for one regular pizza at three different pizzerias are shown in the table.</p><p><img alt="image dc3a3208bce04d0398af01b84816de4e" id="dc3a3208bce04d0398af01b84816de4e" src="https://storage.googleapis.com/pie-prod-221718-assets/image/90749ad9-968c-4c80-95fe-a83f8a1647cd"></p><p>Six different pizza orders and costs are shown below. Drag and drop each order and cost to&#160;the correct pizzeria.</p>',
//   partialScoring: true,
//   correctResponse: [
//     {
//       choices: ['0', '4'],
//       category: '0',
//     },
//     {
//       choices: ['2', '3'],
//       category: '1',
//     },
//     {
//       choices: ['1', '5'],
//       category: '2',
//     },
//   ],
//   choicesPosition: 'below',
//   lockChoiceOrder: false,
// };
// const E216 = {
//   choices: [
//     {
//       categoryCount: 1,
//       content: 'to present limitations of the theory',
//       id: '0',
//     },
//     {
//       categoryCount: 1,
//       content: 'to state the theory',
//       id: '1',
//     },
//     {
//       categoryCount: 1,
//       content: 'to give evidence that the theory is correct',
//       id: '2',
//     },
//     {
//       id: '3',
//       categoryCount: 1,
//       content: 'to explain the purpose of the paragraph',
//     },
//     {
//       categoryCount: 1,
//       content: 'to explain how the theory was reached',
//       id: '4',
//     },
//     {
//       categoryCount: 1,
//       content: 'to explain the science behind the theory',
//       id: '5',
//     },
//   ],
//   categories: [
//     {
//       id: '0',
//       label: 'Purpose of the Sentence',
//     },
//     {
//       id: '1',
//       label: '',
//     },
//     {
//       id: '2',
//       label: '',
//     },
//     {
//       id: '3',
//       label: '',
//     },
//     {
//       id: '4',
//       label: '',
//     },
//     {
//       id: '5',
//       label: '',
//     },
//   ],
//   categoriesPerRow: 1,
//   rationale:
//     '<p>Each sentence in the paragraph serves a purpose in the paragraph&#39;s development:</p><p>Sentence 1 explains the purpose of the paragraph, to describe a theory on which kind of nap is best.</p><p>Sentence 2 states the theory, that people should take a 15-minute nap.</p><p>Sentence 3 explains the science behind the theory, that memory is turned off when the brain is sleepy.</p><p>Sentence 4 explains how the theory was reached, as a deduction based on the experiment.</p><p>Sentence 5 presents limitations of the theory.</p><p>Sentence 6 gives evidence that the theory is correct.</p>',
//   prompt:
//     '<p>Drag the purpose of each sentence to its correct classification box. Show the role each sentence serves in developing the paragraph.</p><p>1 What kind of nap is best? 2 Social psychologist and sleep expert James Maas argued that people should take a 15-minute nap when they feel sluggish. 3 By measuring electricity in the brain, he found that when a person is excessively tired, his memory is turned off even when he is awake. 4 Maas deduced that a 15-minute nap would restore the brain&#8217;s full function, including memory. 5 However, a longer 30-minute nap would put a person into Delta&#8212;a deep sleep that leaves a person groggy upon awakening. 6 Over the years, he has found that regular naps improve workers&#8217; health and reaction time, and companies&#39; productivity increases.</p><p></p><p></p>',
//   rowLabels: ['1', '2', '3', '4', '5', '6'],
//   partialScoring: true,
//   correctResponse: [
//     {
//       choices: ['3'],
//       category: '0',
//     },
//     {
//       choices: ['1'],
//       category: '1',
//     },
//     {
//       choices: ['5'],
//       category: '2',
//     },
//     {
//       choices: ['4'],
//       category: '3',
//     },
//     {
//       choices: ['0'],
//       category: '4',
//     },
//     {
//       category: '5',
//       choices: ['2'],
//     },
//   ],
//   choicesPosition: 'below',
//   lockChoiceOrder: false,
// };
// const E215 = {
//   rationale:
//     '<p>The function is increasing over <span class="variable">x</span>-values where the graph is rising from left to right. This occurs for <span class="variable">x</span>-values less than&#160;&#8211;1, between&#160;&#8211;1 and 3, and <span class="variable">x</span>-values larger than 8.&#160;The function is decreasing over <span class="variable">x</span>-values where the graph is falling from left to right. This occurs for <span class="variable">x</span>-values between 3&#160;and 8.</p>',
//   prompt:
//     '<p>Consider the function <span class="variable">f</span>(<span class="variable">x</span>) graphed below.</p><p><img alt="image fa651e86bf6e4ad3b521aa4679941fc0" id="fa651e86bf6e4ad3b521aa4679941fc0" src="https://storage.googleapis.com/pie-prod-221718-assets/image/918fff4d-efeb-4971-9afa-c0a1f2eba825"></p><p>Each inequality represents a range of <span class="variable">x</span>-values over which <span class="variable">f</span>(<span class="variable">x</span>) is defined. Drag and drop the correct statement into each box to classify the behavior of the function over the given range of <span class="variable">x</span>-values.</p>',
//   partialScoring: true,
//   correctResponse: [
//     {
//       category: '0',
//       choices: ['0'],
//     },
//     {
//       category: '1',
//       choices: ['0'],
//     },
//     {
//       choices: ['1'],
//       category: '2',
//     },
//     {
//       choices: ['0'],
//       category: '3',
//     },
//   ],
//   choicesPosition: 'below',
//   lockChoiceOrder: false,
//   choices: [
//     {
//       content: '<em>f</em>(<em>x</em>) is increasing',
//       id: '0',
//     },
//     {
//       id: '1',
//       content: '<span><em>f</em>(<em>x</em>) is decreasing</span>',
//     },
//     {
//       content: '<em>f</em>(<em>x</em>)<em> </em>is constant',
//       id: '2',
//     },
//   ],
//   categories: [
//     {
//       id: '0',
//       label: '<em>x</em> &lt; &#8722; 1',
//     },
//     {
//       id: '1',
//       label: '&#8722; 1 &lt; <em>x</em> &lt; 3',
//     },
//     {
//       id: '2',
//       label: '3 &lt; <em>x</em> &lt; 8',
//     },
//     {
//       id: '3',
//       label: '<em>x</em> &gt; 8',
//     },
//   ],
//   categoriesPerRow: 4,
// };

exports.model = (id, element) => ({
  id,
  element,
  promptEnabled: true,

  choices: [
    {
      id: 'id-mar',
      content: '<div>mar</div>',
    },
    {
      id: 'id-para',
      content: '<div>para</div>',
    },
    {
      id: 'id-rosie',
      content: '<div>rosie</div>',
    },
    {
      id: 'id-morcov',
      content: '<div>morcov</div>',
      categoryCount: 2,
    },
  ],
  choicesPosition: 'below',
  choicesLabel: '',
  lockChoiceOrder: true,
  removeTilesAfterPlacing: false,
  categoriesPerRow: 2,
  categories: [
    {
      id: 'id-fructe',
      label: '<div>fructe</div>',
    },
    {
      id: 'id-legume',
      label: '<div>legume</div>',
    },
  ],
  alternates: [],
  correctResponse: [
    {
      category: 'id-fructe',
      choices: ['id-mar', 'id-mar', 'id-mar', 'id-para'],
      alternateResponses: [
        ['id-mar', 'id-para', 'id-rosie'],
        ['id-mar', 'id-para', 'id-rosie'],
      ],
    },
    {
      category: 'id-legume',
      choices: ['id-rosie', 'id-rosie', 'id-morcov'],
      alternateResponses: [['id-rosie', 'id-morcov'], ['id-morcov']],
    },
  ],
  note: 'The answer shown above is the most common correct answer for this item. One or more additional correct answers are also defined, and will also be recognized as correct.',
  rowLabels: ['', ''],
  partialScoring: true,
  feedbackEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
});
