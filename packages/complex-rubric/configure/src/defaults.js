import { RUBRIC_TYPES } from '@pie-lib/pie-toolbox/rubric';

const multiTraitDefaultModel = {
  description: false,
  excludeZero: false,
  halfScoring: false,
  pointLabels: true,
  scales: [],
  standards: false,
  visibleToStudent: true,
};

const rubricDefaultModel = {
  points: ['', '', '', ''],
  sampleAnswers: [null, null, null, null],
  maxPoints: 3,
  excludeZero: false,
};

const rubriclessDefaultModel = {
  maxPoints: 100,
  excludeZero: false,
  rubriclessInstructionEnabled: true,
};

const multiTraitDefaultConfiguration = {
  baseInputConfiguration: {
    audio: { disabled: false },
    video: { disabled: false },
    image: { disabled: false },
    textAlign: { disabled: true },
  },
  expandedInput: {
    inputConfiguration: {
      math: { disabled: true },
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
  },
  labelInput: {
    inputConfiguration: {
      math: { disabled: true },
      audio: { disabled: true },
      video: { disabled: true },
      image: { disabled: true },
    },
  },
  settingsPanelDisabled: false,
  excludeZeroDialogBoxContent: {
    title: 'Exclude 0 (Zero) from Score Point Values.',
    text: `<div>
        You are about to exclude 0 from score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the left
          </li>
          <li>
            remove 0 column with its Label and Description
          </li>
        </ul>
      </div>`,
  },
  includeZeroDialogBoxContent: {
    title: 'Include 0 (Zero) in Score Point Values.',
    text: `<div>
        You are about to include 0 in score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the right
          </li>
          <li>
            add 0 column with empty Label and Descriptions
          </li>
        </ul>
      </div>`,
  },
  deleteScaleDialogBoxContent: {
    title: 'Delete Scale',
    text: 'Are you sure you want to delete this scale?',
  },
  maxPointsDialogBoxContent: {
    title: 'Decreasing Max Points.',
    text: ` You are about to decrease max score point value.
        <br/>
        All the Labels and Descriptions for scores above Max Point will be deleted.`,
  },
  spellCheck: {
    label: 'Spellcheck',
    settings: false,
    enabled: true,
  },
  showExcludeZero: {
    settings: true,
    label: 'Exclude Zero',
  },
  showScorePointLabels: {
    settings: true,
    label: 'Show Score Point Labels',
  },
  showDescription: {
    settings: true,
    label: 'Show Description',
  },
  showVisibleToStudent: {
    settings: true,
    label: 'Visible to Student',
  },
  showHalfScoring: {
    settings: true,
    label: 'Half Scoring',
  },
  // commenting this in order to use the dynamic width if the width was not set by the client (PD-3203)
  // width: '900px',
  // these should not be set to true (should not be used) for now
  showStandards: {
    settings: false,
    label: 'Show Standards',
  },
  showLevelTagInput: {
    settings: false,
    label: 'Show Level Tag Input',
    enabled: false,
  },
  dragAndDrop: {
    settings: true,
    label: 'Enable Drag and Drop',
    enabled: false,
  },
  maxMaxPoints: 9,
};

const rubricDefaultConfiguration = {
  baseInputConfiguration: {
    audio: { disabled: false },
    video: { disabled: false },
    image: { disabled: false },
    textAlign: { disabled: true },
  },
  showExcludeZero: {
    settings: true,
    label: 'Ability to exclude zero',
  },
  showMaxPoint: {
    settings: true,
    label: 'Show max points dropdown',
  },
  settingsPanelDisabled: false,
  maxMaxPoints: 9,
};

const rubriclessDefaultConfiguration = {
  baseInputConfiguration: {
    audio: { disabled: false },
    video: { disabled: false },
    image: { disabled: false },
    textAlign: { disabled: true },
  },
  showExcludeZero: {
    settings: true,
    label: 'Ability to exclude zero',
  },
  showMaxPoint: {
    settings: true,
    label: 'Show max points dropdown',
  },
  settingsPanelDisabled: false,
  // shows us if it simple rubric or rubricless(simple rubric with less structure)
  rubricless: true,
  // scoring instruction for rubricless
  rubriclessInstruction: {
    settings: true,
    label: 'Instruction',
    inputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
  },
  maxMaxPoints: 100,
};

export default {
  model: {
    rubricType: 'simpleRubric',
    rubrics: {
      [RUBRIC_TYPES.SIMPLE_RUBRIC]: rubricDefaultModel,
      [RUBRIC_TYPES.MULTI_TRAIT_RUBRIC]: multiTraitDefaultModel,
      [RUBRIC_TYPES.RUBRICLESS]: rubriclessDefaultModel,
    },
  },
  configuration: {
    // width: '770px',
    rubricOptions: ['simpleRubric', 'multiTraitRubric', 'rubricless'],
    [RUBRIC_TYPES.MULTI_TRAIT_RUBRIC]: multiTraitDefaultConfiguration,
    [RUBRIC_TYPES.SIMPLE_RUBRIC]: rubricDefaultConfiguration,
    [RUBRIC_TYPES.RUBRICLESS]: rubriclessDefaultConfiguration,
  },
};
