const tokens = () => [
  {
    text: "If 'tweren't for sight and sound and smell,",
    start: 0,
    end: 43,
  },
  {
    text: "I'd like the city pretty well,",
    start: 44,
    end: 74,
  },
  {
    text: 'But when it comes to getting rest,',
    start: 75,
    end: 109,
  },
  {
    text: 'I like the country lots the best.',
    start: 110,
    end: 143,
  },
  {
    text: 'Sometimes it seems to me I must',
    start: 145,
    end: 176,
  },
  {
    text: "Just quit the city's din and dust,",
    start: 177,
    end: 211,
  },
  {
    text: 'And get out where the sky is blue,',
    start: 212,
    end: 246,
  },
  {
    text: 'And say, now, how does it seem to you?',
    start: 247,
    end: 285,
  },
];

const mathSampleTokens = [
  {
    start: 583,
    end: 1465,
    text: '<span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mrow>\n      <mo>[</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>+</mo>\n      <mn>2</mn>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>]</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>)</mo>\n    </mrow>\n  </mstyle>\n</math></span>',
    correct: true,
  },
  { start: 1474, end: 2218 },
  { start: 2227, end: 2797 },
  { start: 2806, end: 3112 },
];

const base = (extras) =>
  Object.assign(
    {},
    {
      // highlightChoices: true,
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct',
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect',
        },
        partial: {
          type: 'default',
          default: 'Nearly',
        },
      },
      partialScoring: false,
      maxSelections: 2,
      mode: 'sentence',
      rationale: 'Rationale goes here.',
      prompt: 'What sentences contain the character 6 in them?',
      promptEnabled: true,
      toolbarEditorPosition: 'bottom',
      // text: `<p>Warhol was born in 1928 in Pittsburgh, Pennsylvania. When he was eight years old, he became very sick and had to stay in bed for months. To help him pass the time his mother, who was an artist, taught him how to draw. He took to it like a fish to water. Art became the center of Andy's world. A year later he added picture-taking to his interests when his mother gave him a camera. He also became fascinated with movies.</p><p>Andy studied art in school and learned many ways to make art. He learned how to use different art materials, such as oil paints, metal, clay, and wood. In 1949 he moved to New York City, where he got a job drawing and painting pictures for magazines.</p>`,
      text: `<p>If 'tweren't for sight and sound and smell,<br />
I'd like the city pretty well,<br />
But when it comes to getting rest,<br />
I like the country lots the best.</p>

<p>Sometimes it seems to me I must<br />
Just quit the city's din and dust,<br />
And get out where the sky is blue,<br />
And say, now, how does it seem to you?</p>`,
      tokens: tokens(),
    },
    extras,
  );

const mathSample = (extras) => {
  return Object.assign(
    {},
    {
      highlightChoices: false,
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct',
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect',
        },
        partial: {
          type: 'default',
          default: 'Nearly',
        },
      },
      partialScoring: false,
      maxSelections: 2,
      prompt: 'What sentences contain the character 6 in them?',
      text: `<p>If 'tweren't for sight and sound and smell,<br />
I'd like the city pretty well,<br />
But when it comes to getting rest,<br />
I like the country lots the best.</p>

<p>Sometimes it seems to me I must<br />
Just quit the city's din and dust,<br />
And get out where the sky is blue,<br />
And say, now, how does it seem to you?</p>`,
      tokens: mathSampleTokens,
    },
    extras,
  );
};

exports.mathSample = (id, element) => {
  return Object.assign({}, { id, element }, mathSample({}));
};

exports.htmlSample = (id, element) => {
  return Object.assign(
    {},
    { id, element },
    {
      highlightChoices: true,
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct',
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect',
        },
        partial: {
          type: 'default',
          default: 'Nearly',
        },
      },
      partialScoring: false,
      text: '<p style=\'padding: 20px\'>A flicker and then gone. In its wake, only <span class="lrn_token">the after-echo of a distant high-pitched ringing that vibrated through him even as it returned to silence once again</span>, as he stared into the smiling faces of the crew and told himself that yes he was meant to be here, that <span class="lrn_token">it had been his destiny to succeed and so he had succeeded</span>, the sense of panic already replaced by the pride of his accomplishment, replaced so completely that he would not remember that flicker, would not allow himself to remember, <span class="lrn_token">even after everything else had happened</span>. In his memory of that moment, <span class="lrn_token">he was an astronaut and they were welcoming him aboard the space station</span>. And in his memory he was smiling. Is this not what he was meant to do? Is the answer not as fixed and indisputable as any equation he might have been tasked to solve?</p>\n',
      prompt:
        '<p>Select the <span class="relative-emphasis">one</span> phrase below that suggests that in the future, Keith may interpret this moment differently.</p>',
      maxSelections: 2,
      mode: 'sentence',
      rationale: 'Rationale goes here.',
      tokens: [
        {
          correct: false,
          start: 67,
          end: 215,
          text: '<span class="lrn_token">the after-echo of a distant high-pitched ringing that vibrated through him even as it returned to silence once again</span>',
        },
        {
          correct: false,
          start: 321,
          end: 410,
          text: '<span class="lrn_token">it had been his destiny to succeed and so he had succeeded</span>',
        },
        {
          correct: true,
          start: 585,
          end: 655,
          text: '<span class="lrn_token">even after everything else had happened</span>',
        },
        {
          correct: false,
          start: 687,
          end: 790,
          text: '<span class="lrn_token">he was an astronaut and they were welcoming him aboard the space station</span>',
        },
      ],
    },
  );
};

exports.htmlAscii = (id, element) => ({
  id,
  element,
  highlightChoices: true,
  prompt: 'Select the parts that have references for Lucy',
  text: '<p>&#8220;Lucy? Are you using your time wisely to plan your project?&#8221; Mr. Wilson asked.</p><p>&nbsp;Lucy looked a little confused at first.</p>',
  tokens: [
    {
      start: 10,
      end: 68,
      text: 'Lucy? Are you using your time wisely to plan your project?',
    },
    {
      start: 106,
      end: 145,
      text: 'Lucy looked a little confused at first.',
    },
  ],
});

// table
const E556799 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 77,
      end: 201,
      text: 'In 1982, he married his childhood sweetheart, Nanette, and co–authored <em>The Artist’s Guide to Sketching with Gurney</em>.',
      oldStart: 70,
      oldEnd: 206,
    },
    {
      correct: false,
      start: 209,
      end: 342,
      text: 'He and Gurney went on to be employed by Ralph Bakshi Studios to create background art for the animated feature <em>Fire and Ice</em>.',
      oldStart: 214,
      oldEnd: 347,
    },
    {
      correct: false,
      start: 350,
      end: 463,
      text: 'From 1984 to 1989, Kinkade published many paintings, so that by 1994, he was a published artist in his own right.',
      oldStart: 355,
      oldEnd: 468,
    },
    {
      correct: false,
      start: 471,
      end: 598,
      text: 'That year, he earned the honorary title of Artist of the Year from the National Association of Limited Edition Dealers (NALED).',
      oldStart: 476,
      oldEnd: 603,
    },
    {
      correct: false,
      start: 606,
      end: 697,
      text: 'An era in landscape artistry had begun that would make a lasting impression in art history.',
      oldStart: 611,
      oldEnd: 702,
    },
    {
      correct: false,
      start: 705,
      end: 827,
      text: 'He went on to publish more art books and receive more recognition, collecting fans as rapidly as they collected his works.',
      oldStart: 710,
      oldEnd: 832,
    },
    {
      correct: true,
      start: 857,
      end: 972,
      text: "One of the unique qualities of Kinkade's work is that he hides messages to his wife and daughters in each painting.",
      oldStart: 862,
      oldEnd: 977,
    },
    {
      correct: true,
      start: 980,
      end: 1060,
      text: 'For example, for his wife, Nanette, he paints a hidden letter “N” in each piece.',
      oldStart: 985,
      oldEnd: 1077,
    },
    {
      correct: true,
      start: 1068,
      end: 1144,
      text: "His four daughters' names, as well as their faces, also appear in his works.",
      oldStart: 1085,
      oldEnd: 1161,
    },
    {
      correct: false,
      start: 1152,
      end: 1293,
      text: 'Some people say that Kinkade is a passing craze of the twenty–first century; however, it is clear that he has staying power in the art world.',
      oldStart: 1169,
      oldEnd: 1316,
    },
    {
      correct: false,
      start: 1301,
      end: 1430,
      text: 'His works soothe the senses and inspire the mind because he captures the essence of light, the force on which human life thrives.',
      oldStart: 1324,
      oldEnd: 1453,
    },
  ],
  text: '<table><tbody><tr><td style="border:solid 1px black;"><p class="kds-indent"> In 1982, he married his childhood sweetheart, Nanette, and co–authored <em>The Artist’s Guide to Sketching with Gurney</em>. &nbsp; He and Gurney went on to be employed by Ralph Bakshi Studios to create background art for the animated feature <em>Fire and Ice</em>. &nbsp; From 1984 to 1989, Kinkade published many paintings, so that by 1994, he was a published artist in his own right. &nbsp; That year, he earned the honorary title of Artist of the Year from the National Association of Limited Edition Dealers (NALED). &nbsp; An era in landscape artistry had begun that would make a lasting impression in art history. &nbsp; He went on to publish more art books and receive more recognition, collecting fans as rapidly as they collected his works.  </p><p class="kds-indent">  One of the unique qualities of Kinkade\'s work is that he hides messages to his wife and daughters in each painting. &nbsp; For example, for his wife, Nanette, he paints a hidden letter “N” in each piece. &nbsp; His four daughters\' names, as well as their faces, also appear in his works. &nbsp; Some people say that Kinkade is a passing craze of the twenty–first century; however, it is clear that he has staying power in the art world. &nbsp; His works soothe the senses and inspire the mind because he captures the essence of light, the force on which human life thrives.      </p></td></tr></tbody></table>',
  prompt:
    '<div>The reader can infer that Kinkade is dedicated to his family.&#160; Click on the <em>three</em> sentences in the text that <em>best</em> support this inference. </div>',
  feedbackEnabled: false,
  highlightChoices: false,
  maxSelections: 3,
  mode: 'sentence',
  promptEnabled: true,
  rationale: '',
  rationaleEnabled: true,
  scoringType: 'auto',
  studentInstructionsEnabled: true,
  teacherInstructions: '',
  teacherInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
};

// br lines
const E231099 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 3,
      end: 88,
      text: 'Why, who makes much of a miracle?<br />\nAs to me I know of nothing else but miracles.',
    },
    {
      correct: false,
      start: 95,
      end: 198,
      text: 'Whether I walk the streets of Manhattan,<br />\nOr dart my sight over the roofs of houses toward the sky',
    },
    {
      correct: false,
      start: 205,
      end: 316,
      text: 'Or wade with naked feet along the beach just in the edge of the water,<br />\nOr stand under trees in the woods,',
    },
    {
      correct: true,
      start: 323,
      end: 513,
      text: 'Or talk by day with any one I love, or sleep in the bed at night with any one I love,<br />\nOr sit at table at dinner with the rest,<br />\nOr look at strangers opposite me riding in the car,',
    },
    {
      correct: false,
      start: 520,
      end: 681,
      text: 'Or watch honey-bees buys around the hive of a summer forenoon,<br />\nOr animals feeding in the fields,<br />\nOr birds, or the wonderfulness of insects in the air',
    },
  ],
  text: '<p>Why, who makes much of a miracle?<br />\nAs to me I know of nothing else but miracles.<br />\nWhether I walk the streets of Manhattan,<br />\nOr dart my sight over the roofs of houses toward the sky<br />\nOr wade with naked feet along the beach just in the edge of the water,<br />\nOr stand under trees in the woods,<br />\nOr talk by day with any one I love, or sleep in the bed at night with any one I love,<br />\nOr sit at table at dinner with the rest,<br />\nOr look at strangers opposite me riding in the car,<br />\nOr watch honey-bees buys around the hive of a summer forenoon,<br />\nOr animals feeding in the fields,<br />\nOr birds, or the wonderfulness of insects in the air</p>\n',
  prompt:
    '<p>Select the ONE set of lines from the poem that describes how human interactions&#160;can be miracles.</p>',
  rationale:
    '<p>Lines 7&#8211;9 are correct because they describe the miracle of strangers as well as the miracle of loved ones.</p>',
  maxSelections: 1,
};

// superscript markup
const E684376 = {
  teacherInstructions: '',
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 3,
      end: 188,
      text: 'And most of all, we are honored to be in the presence of men and women whose lives are a testament to the endurance and the strength of the human spirit &#8212; the inspiring survivors.',
    },
    {
      correct: false,
      start: 249,
      end: 479,
      text: 'As I&#8217;ve told some of you before, I grew up hearing stories about my great uncle &#8212; a soldier in the 89th Infantry Division who was stunned and shaken by what he saw when he helped to liberate Ordruf, part of Buchenwald.',
    },
    {
      correct: false,
      start: 480,
      end: 641,
      text: 'And I&#8217;ll never forget what I saw at Buchenwald, where so many perished with the words of Sh&#8217;ma Yis&#8217;ra&#8217;eil<sup>1</sup>&#160;on their lips.',
    },
    {
      correct: false,
      start: 650,
      end: 811,
      text: 'I&#8217;ve stood with survivors, in the old Warsaw ghettos, where a monument honors heroes who said we will not go quietly; we will stand up, we will fight back.',
    },
    {
      correct: false,
      start: 812,
      end: 971,
      text: 'And I&#8217;ve walked those sacred grounds at Yad Vashem,<sup>2</sup>&#160;with its lesson for all nations &#8212; the Shoah<sup>3</sup>&#160;cannot be denied.',
    },
    {
      correct: true,
      start: 1267,
      end: 1339,
      text: 'That&#8217;s why we&#8217;re here. Not simply to remember, but to speak.',
    },
  ],
  text: '<p>And most of all, we are honored to be in the presence of men and women whose lives are a testament to the endurance and the strength of the human spirit &#8212; the inspiring survivors. It is a privilege to be with you, on a very personal level. As I&#8217;ve told some of you before, I grew up hearing stories about my great uncle &#8212; a soldier in the 89th Infantry Division who was stunned and shaken by what he saw when he helped to liberate Ordruf, part of Buchenwald. And I&#8217;ll never forget what I saw at Buchenwald, where so many perished with the words of Sh&#8217;ma Yis&#8217;ra&#8217;eil<sup>1</sup>&#160;on their lips.</p>\n\n<p>I&#8217;ve stood with survivors, in the old Warsaw ghettos, where a monument honors heroes who said we will not go quietly; we will stand up, we will fight back. And I&#8217;ve walked those sacred grounds at Yad Vashem,<sup>2</sup>&#160;with its lesson for all nations &#8212; the Shoah<sup>3</sup>&#160;cannot be denied.</p>\n\n<p>&#160;During my visit to Yad Vashem I was given a gift, inscribed with those words from the Book of Joel: "Has the like of this happened in your days or in the days of your fathers? Tell your children about it, and let your children tell theirs, and their children the next generation." That&#8217;s why we&#8217;re here. Not simply to remember, but to speak.</p>\n',
  prompt:
    '<p>Select the detail in paragraphs 5 through 7 of the speech that <span class="relative-emphasis">best</span> supports the speech\'s main idea.</p>',
  rationale:
    "<p>The importance of speaking out about the Holocaust is highlighted as the main idea. The message of teaching future generations about the Holocaust is conveyed in Joel's words, but the specific detail \"That's why we're here. Not simply to remember, but to speak\" strongly emphasizes the significance of not just&#160;preserving&#160;the history of the Holocaust,&#160;but also actively speaking up about it.</p>",
  maxSelections: 1,
};

// bold markup
const E576047 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 112,
      end: 194,
      text: 'Gorillas eat mostly leaves, stems, and other plant parts found in the rainforests.',
    },
    {
      correct: false,
      start: 201,
      end: 247,
      text: 'Adult males eat about 45 pounds of food a day.',
    },
    {
      correct: false,
      start: 254,
      end: 295,
      text: 'Females eat only about 30 pounds of food.',
    },
    {
      correct: false,
      start: 302,
      end: 354,
      text: 'The troop will not stay in the same place every day.',
    },
    {
      correct: false,
      start: 361,
      end: 402,
      text: 'They move so they do not run out of food.',
    },
    {
      correct: false,
      start: 409,
      end: 447,
      text: 'Gorillas spend most of the day eating.',
    },
    {
      correct: false,
      start: 475,
      end: 551,
      text: 'Over time, gorillas have developed a way of life to continue their survival.',
    },
    {
      correct: false,
      start: 558,
      end: 626,
      text: 'They spend most of their day eating and relaxing in the rainforests.',
    },
    {
      correct: true,
      start: 633,
      end: 678,
      text: 'They are the gentle giants of the rainforest.',
    },
  ],
  text: '<table><tr><td style="border:solid 1px black;"><strong>Food Sources <br /><br /></strong><p class="kds-indent"> Gorillas eat mostly leaves, stems, and other plant parts found in the rainforests. &#160;Adult males eat about 45 pounds of food a day. &#160;Females eat only about 30 pounds of food. &#160;The troop will not stay in the same place every day. &#160;They move so they do not run out of food. &#160;Gorillas spend most of the day eating. </p><p class="kds-indent"> Over time, gorillas have developed a way of life to continue their survival.&#160; They spend most of their day eating and relaxing in the rainforests. &#160;They are the gentle giants of the rainforest. </p></td></tr></table>',
  prompt: '<div>Click on the sentence that BEST describes the main idea of the passage.</div>',
};

// break markup
const E562770 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 47,
      end: 117,
      text: 'Birdie, rest a little longer,<br />Till thy little wings are stronger.',
    },
    {
      correct: true,
      start: 123,
      end: 178,
      text: 'So she rests a little longer,<br />Then she flies away.',
    },
    {
      correct: false,
      start: 185,
      end: 243,
      text: 'What does little baby say,<br />In her bed at peep of day?',
    },
    {
      correct: true,
      start: 250,
      end: 311,
      text: 'Baby says, like little birdie,<br />Let me rise and fly away.',
    },
    {
      correct: false,
      start: 318,
      end: 387,
      text: 'Baby, sleep a little longer,<br />Till thy little limbs are stronger.',
    },
    {
      correct: true,
      start: 394,
      end: 454,
      text: 'If she sleeps a little longer,<br />Baby too shall fly away.',
    },
  ],
  text: '<table><tr><td style="border:solid 1px black;">Birdie, rest a little longer,<br />Till thy little wings are stronger.<br />So she rests a little longer,<br />Then she flies away. <br />What does little baby say,<br />In her bed at peep of day? <br />Baby says, like little birdie,<br />Let me rise and fly away. <br />Baby, sleep a little longer,<br />Till thy little limbs are stronger. <br />If she sleeps a little longer,<br />Baby too shall fly away. </td></tr></table>',
  prompt:
    '<div>Read this conclusion about the text and the directions that follow.<br /><br /><table><tbody><tr><td style="border:solid 1px black;">When children eventually grow up and become independent, they seek to leave their parents\' homes and venture into the world alone.</td></tr></tbody></table><br />Click on the <em>three</em> sentences that <em>best</em> supports this conclusion.</div>',
};

// underline markup
const E264494 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 111,
      end: 115,
      text: 'good',
    },
    {
      correct: true,
      start: 118,
      end: 127,
      text: 'wonderful',
    },
    {
      correct: true,
      start: 374,
      end: 385,
      text: 'celebration',
    },
    {
      correct: false,
      start: 388,
      end: 393,
      text: 'party',
    },
  ],
  text: '<p>The community garden looks beautiful this summer! The roses in the flower section are blooming and their <u>good / wonderful</u> smell covers the whole area. The cucumbers and tomatoes are almost ripe and ready to eat. Our entire block is proud of what we did this year. It took many people and many hours of work to complete the garden, but we did it! We will have a <u>celebration / party</u> next week.</p>\n',
  prompt:
    '<p>A student is writing a story and wants to revise it to make the language clearer. For each underlined pair of words, select the word that is the most descriptive choice for the story.</p>',
  rationale:
    '<p>The best choice from each pair is&#160;<span class="word-callout">wonderful</span> and <span class="word-callout">celebration</span>.</p><p>Both choices are more specific and descriptive of the subject.</p><p></p>',
  maxSelections: 2,
};

// list markup - ul list
const E225699 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 45,
      end: 84,
      text: 'Solar panels are not 100% efficient yet',
    },
    {
      correct: false,
      start: 86,
      end: 151,
      text: 'Therefore, single solar panels are not enough to get the job done',
    },
    {
      correct: false,
      start: 153,
      end: 233,
      text: 'Anyone looking to utilize solar energy should be prepared to get multiple panels',
    },
    {
      correct: false,
      start: 273,
      end: 340,
      text: 'Unfortunately, pollution degrades solar panels over periods of time',
    },
    {
      correct: false,
      start: 384,
      end: 454,
      text: 'Like pollution, clouds also reduce the energy of the Sun&#8217;s rays.',
    },
    {
      correct: false,
      start: 455,
      end: 506,
      text: 'Solar energy is most useful when the Sun is shining',
    },
    {
      correct: false,
      start: 508,
      end: 648,
      text: 'During the nighttime hours (or in areas like Seattle, Washington, that do not normally have a lot of sunny days), solar equipment is useless',
    },
    {
      correct: false,
      start: 650,
      end: 745,
      text: 'Solar battery chargers may eliminate this concern, but it costs more money to purchase chargers',
    },
    {
      correct: false,
      start: 786,
      end: 837,
      text: 'A ton of solar panels on the exterior of your home?',
    },
    {
      correct: false,
      start: 838,
      end: 847,
      text: 'No thanks',
    },
    {
      correct: false,
      start: 849,
      end: 916,
      text: 'If you are opting for solar energy, there is no other way around it',
    },
    {
      correct: false,
      start: 918,
      end: 1014,
      text: 'Solar panels must be placed on the outside of your home in order to reflect the Sun&#8217;s rays',
    },
    {
      correct: false,
      start: 1016,
      end: 1079,
      text: 'Do this and you risk decreasing the overall beauty of your home',
    },
    {
      correct: false,
      start: 1149,
      end: 1234,
      text: 'The production of solar cells and the disposal of solar cells can&#8217;t be ignored.',
    },
    {
      correct: true,
      start: 1235,
      end: 1367,
      text: 'Chemicals from the production of solar panels can leak into the water supply, and gases may be released into the air from production',
    },
    {
      correct: false,
      start: 1369,
      end: 1417,
      text: 'That&#8217;s not good for the environment, is it',
    },
    {
      correct: false,
      start: 1417,
      end: 1418,
      text: '?',
    },
  ],
  text: '<ul>\n\t<li><strong>Less is not more:</strong> Solar panels are not 100% efficient yet. Therefore, single solar panels are not enough to get the job done. Anyone looking to utilize solar energy should be prepared to get multiple panels.</li>\n\t<li><strong>Pollution:</strong> Unfortunately, pollution degrades solar panels over periods of time.</li>\n\t<li><strong>On cloud nine:</strong> Like pollution, clouds also reduce the energy of the Sun&#8217;s rays. Solar energy is most useful when the Sun is shining. During the nighttime hours (or in areas like Seattle, Washington, that do not normally have a lot of sunny days), solar equipment is useless. Solar battery chargers may eliminate this concern, but it costs more money to purchase chargers.</li>\n\t<li><strong>Appearance:</strong> A ton of solar panels on the exterior of your home? No thanks. If you are opting for solar energy, there is no other way around it. Solar panels must be placed on the outside of your home in order to reflect the Sun&#8217;s rays. Do this and you risk decreasing the overall beauty of your home.</li>\n\t<li><strong>Production and disposal of solar panels:</strong> The production of solar cells and the disposal of solar cells can&#8217;t be ignored. Chemicals from the production of solar panels can leak into the water supply, and gases may be released into the air from production. That&#8217;s not good for the environment, is it?</li>\n</ul>\n',
  prompt:
    '<p>The author of "Say Yes to Solar Energy" states, "What&#8217;s the best part about this? There are no harmful fuels or threats to the environment."</p><p>Select the sentence&#160;below from "Say No to Solar Energy" that directly opposes this claim.</p>',
  rationale:
    '<p>The highlighted sentence in the last section&#160;provides evidence that there may indeed be harmful side effects to the environment from the production of solar panels. The other sentences also describe drawbacks, but none of them directly oppose the claim&#160;of the first author.</p>',
  maxSelections: 1,
};

// list markup - ol list
const E557261 = {
  teacherInstructions: '',
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 103,
      end: 192,
      text: 'When some of the water in a lake or ocean rises up and moves across the top of the water.',
    },
    {
      correct: true,
      start: 216,
      end: 278,
      text: 'You move your hand or arm up and down or backward and forward.',
    },
  ],
  text: '<table><tbody><tr><td style="border:solid 1px black;"><strong>Wave</strong> [weIv]<br>Noun<br><ol><li> When some of the water in a lake or ocean rises up and moves across the top of the water.</li></ol> Verb<ol><li> You move your hand or arm up and down or backward and forward.</li></ol></td></tr></tbody></table>',
  prompt:
    '<div>Click the BEST definition for the underlined word.<br />&#160;<table><tbody><tr><td style="border:solid 1px black;">I <span class="kds-underline">wave</span> every time I see one of my friends.</td></tr></tbody></table></div>',
  rationale: '<p>You move your hand or arm up and down or backward and forward.</p>',
};

// text center
const E211874 = {
  partialScoring: true,
  tokens: [
    {
      correct: false,
      start: 146,
      end: 261,
      text: 'Horizontal hydraulic fracturing, or &#8220;fracking,&#8221; is a drilling method commonly used in the United States',
    },
    {
      correct: false,
      start: 263,
      end: 340,
      text: 'It helps release shale gas from shale deposits deep below Earth&#8217;s crust',
    },
    {
      correct: false,
      start: 342,
      end: 387,
      text: 'High-powered drills push deep into the ground',
    },
    {
      correct: false,
      start: 389,
      end: 493,
      text: 'Just before they reach the thick layers of shale, the drills turn and dig horizontally through the shale',
    },
    {
      correct: false,
      start: 495,
      end: 593,
      text: 'After that, small underground explosions are created to fracture or make small cracks in the shale',
    },
    {
      correct: false,
      start: 595,
      end: 695,
      text: 'Then, large amounts of water and a 1-percent mixture of sand and chemicals are forced into the holes',
    },
    {
      correct: false,
      start: 697,
      end: 763,
      text: 'The sand and water keep the cracks open to release the natural gas',
    },
    {
      correct: true,
      start: 765,
      end: 863,
      text: 'Fracking has many benefits, and the United States should continue to use it to produce natural gas',
    },
  ],
  text: '<p class="text-center"><span class="no-number"><strong>America&#8217;s Alternative Energy Source</strong></span></p>\n\n<p>&#160;&#160;&#160;&#160; Horizontal hydraulic fracturing, or &#8220;fracking,&#8221; is a drilling method commonly used in the United States. It helps release shale gas from shale deposits deep below Earth&#8217;s crust. High-powered drills push deep into the ground. Just before they reach the thick layers of shale, the drills turn and dig horizontally through the shale. After that, small underground explosions are created to fracture or make small cracks in the shale. Then, large amounts of water and a 1-percent mixture of sand and chemicals are forced into the holes. The sand and water keep the cracks open to release the natural gas. Fracking has many benefits, and the United States should continue to use it to produce natural gas.</p>\n',
  prompt:
    '<p>Select <span class="relative-emphasis">one</span> sentence from below that <span class="relative-emphasis">best</span> shows the author&#8217;s main purpose for writing the text.</p>',
  rationale:
    "<p>This sentence best reveals the author's purpose: to show that fracking has many benefits and should be continued.</p>",
  maxSelections: 1,
};

const defaultModel = base({
  // "id": "8a808081701d693801703174fb900421",
  teacherInstructions: '',
  partialScoring: true,
  prompt:
    '<p>Select the sentence from&#160;&#34;The Gymnast&#34; that <span class="relative-emphasis">best</span> represents the theme.</p>',
  rationale:
    '<p>The final sentence of the passage best exemplifies the theme of the short story because Natasha&#39;s practice and determination finally pays off.</p>',
  tokens: [
    {
      text: 'She thought about what she had to do, struggling to rein in her wild, fearful thoughts.',
      end: 90,
      start: 3,
      correct: false,
    },
    {
      start: 449,
      end: 585,
      text: 'Just for a hair of a moment, Natasha wondered if she really wanted a perfect 10, so weary was she of trying for but never achieving one.',
      correct: false,
    },
    {
      end: 627,
      correct: false,
      text: "At last Natasha's moment arrived.",
      start: 594,
    },
    {
      end: 743,
      text: "The faces of past giants of gymnastics swam before her mind's eye, now razor&#8211;sharp with fierce determination.",
      correct: false,
      start: 628,
    },
    {
      text: 'Suddenly, the din of the gymnasium was silent to her.',
      end: 997,
      correct: false,
      start: 944,
    },
    {
      end: 1087,
      start: 998,
      correct: false,
      text: 'Forcing all sound out of her mind, she focused on the gleaming balance beam ahead of her.',
    },
    {
      correct: true,
      start: 1088,
      end: 1225,
      text: 'Taking a deep breath, Natasha made her graceful, yet powerful approach, mounted the beam flawlessly, and...executed her first perfect 10.',
    },
  ],
  // "element": "select-text",
  text: "<p>She thought about what she had to do, struggling to rein in her wild, fearful thoughts. Coach Cummings always said that an undisciplined mind never scored a perfect 10. Natasha wanted to please her Coach, yet sometimes his approval wasn't as exciting as his anger. The gymnasts were unanimous about one thing: Coach Cummings's fits of disapproving rage were much more humorous to witness than his infrequent, backslapping moments of high praise. Just for a hair of a moment, Natasha wondered if she really wanted a perfect 10, so weary was she of trying for but never achieving one.</p>\n\n<p>At last Natasha's moment arrived. The faces of past giants of gymnastics swam before her mind's eye, now razor&#8211;sharp with fierce determination. \"I am talented. I am not afraid. I will make a perfect 10,\" she spoke aloud to herself, as she approached the mat, dusted her hands with chalk to prevent slippage, and returned to her starting point. Suddenly, the din of the gymnasium was silent to her. Forcing all sound out of her mind, she focused on the gleaming balance beam ahead of her. Taking a deep breath, Natasha made her graceful, yet powerful approach, mounted the beam flawlessly, and...executed her first perfect 10.</p>\n",
  rubricEnabled: false,
});

exports.model = (id, element) => {
  return Object.assign({}, { id, element }, defaultModel);
};
