exports.model = (id, element) => ({
  id,
  element,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  rationale: null,
  prompt: '<p>Drag and drop the correct mathematical expression into the box next to the matching equation.</p>',
  lockChoiceOrder: true,
  choicesPosition: 'below',
  partialScoring: true,
  choices: [
    {
      id: '0',
      value: '\\(3 \\times 8 = 24\\)',
    },
    {
      id: '1',
      value: '\\(36 \\div 9 = 4\\)',
    },
    {
      id: '2',
      value: '\\(5 \\times 7 = 35\\)',
    },
    {
      id: '3',
      value: '\\(\\frac{x^2 + 2x + 1}{x + 1} = x + 1\\)',
    },
    {
      id: '4',
      value: '\\(\\int_0^1 x^2 dx = \\frac{1}{3}\\)',
    },
  ],
  markup:
    '<table class="table table-bordered table-striped">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td class="text-center"><strong>Word Problem</strong></td>\n\t\t\t<td class="text-center"><strong>Mathematical Expression</strong></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Jamie is buying color pencils for an art project. There are 8 colored pencils in each pack. She buys 3 packs of colored pencils. How many colored pencils did she buy for her art project?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{0}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Mark has 36 jelly beans to split between 9 friends. How many jelly beans will each friend get?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{1}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Mr. Smith drinks 5 bottles of water each day. If there are 7 days in a week, how many bottles of water does Mr. Smith drink in 1 week?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{2}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Simplify the algebraic expression: \\(\\frac{x^2 + 2x + 1}{x + 1}\\)</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{3}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Calculate the definite integral: \\(\\int_0^1 x^2 dx\\)</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{4}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody>\n</table>\n',
  correctResponse: {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  },
  duplicates: false,
  feedback: {},
  mode: 'gather',
  disabled: false,
  teacherInstructions: null,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
