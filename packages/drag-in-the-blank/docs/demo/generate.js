exports.model = (id, element) => ({
  id,
  element,
  'rationaleEnabled': true,
  'promptEnabled': true,
  'teacherInstructionsEnabled': true,
  'studentInstructionsEnabled': true,
  'rationale': null,
  'prompt': '<p>Drag and drop the correct array into the box next to the matching word problem.</p>',
  'lockChoiceOrder': true,
  'choicesPosition': 'below',
  'partialScoring': true,
  'choices': [
    {
      'id':'0',
      'value':'<img alt="" src="https://app.fluence.net/ia/image/3099cb73d5fe400b91b72f2606d1211c" />'
    },
    {
      'id':'1',
      'value':'<img alt="" src="https://app.fluence.net/ia/image/cc6e862dad4749d4a1ae6540ea775179" />'
    },
    {
      'id':'2',
      'value':'<img alt="" src="https://app.fluence.net/ia/image/ab3e342a466941a1a608f65eb7ec1c68" />'
    }
  ],
  'markup': '<table class="table table-bordered table-striped">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td class="text-center"><strong>Word Problem</strong></td>\n\t\t\t<td class="text-center"><strong>Array</strong></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Jamie is buying color pencils for an art project. There are 8 colored pencils in each pack. She buys 3 packs of colored pencils. How many colored pencils did she buy for her art project?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{0}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Mark has 36 jelly beans to split between 9 friends. How many jelly beans will each friend get?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{1}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<p>Mr. Smith drinks 5 bottles of water each day. If there are 7 days in a week, how many bottles of water does Mr. Smith drink in 1 week?</p>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t<p>{{2}}</p>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody>\n</table>\n',
  'correctResponse': {
    '0': '1',
    '1': '0',
    '2': '2'
  },
  'duplicates': false,
  'feedback': {},
  'mode': 'gather',
  'disabled': false,
  'teacherInstructions': null
});
