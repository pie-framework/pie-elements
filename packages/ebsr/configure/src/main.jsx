import React from 'react';
import {
  settings,
  layout
} from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';

const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

const { Panel, toggle, radio, dropdown } = settings;

const styles = theme => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  rationaleHolder: {
    width: '70%',
  },
  rationale: {
    paddingTop: theme.spacing.unit * 2,
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfigurationHolder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  choiceConfiguration: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  },
  addButton: {
    float: 'right'
  }
});

export class Main extends React.Component {
  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      model: props.model
    };
  }

  state = {
    model: {}
  };

  render() {
    const {
      classes,
      model,
      configuration,
      onModelChanged,
      onConfigurationChanged,
    } = this.props;
    const { partA, partB } = model;
    const {
      feedback = {},
      choiceMode = {},
      choicePrefix = {},
      partialScoring = {},
      lockChoiceOrder = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      scoringType = {},
      sequentialChoiceLabels = {},
      partLabels = {},
      partLabelType
    } = configuration || {};
    const type = partLabelType || 'Numbers';
    const typeIsNumber = type === 'Numbers';

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={m => onModelChanged(m, true)}
              configuration={configuration}
              onChangeConfiguration={c => onConfigurationChanged(c, true)}
              groups={{
                'Settings Part A': {
                  'partA.choiceMode':
                    choiceMode.settings &&
                    radio(choiceMode.label, ['checkbox', 'radio']),
                  'partA.choicePrefix': choicePrefix.settings &&
                    radio(choicePrefix.label, ['numbers', 'letters']),
                },
                'Settings Part B': {
                  'partB.choiceMode':
                    choiceMode.settings &&
                    radio(choiceMode.label, ['checkbox', 'radio']),
                  'partB.choicePrefix': choicePrefix.settings &&
                    radio(choicePrefix.label, ['numbers', 'letters']),
                },
                'Settings': {
                  'partLabels.enabled': partLabels.settings &&
                    toggle(partLabels.label, true),
                  partLabelType: partLabels.enabled &&
                    dropdown('', ['Numbers', 'Letters']),
                  'sequentialChoiceLabels.enabled': sequentialChoiceLabels.settings &&
                    toggle(sequentialChoiceLabels.label, true),
                  partialScoring: partialScoring.settings &&
                    toggle(partialScoring.label),
                  lockChoiceOrder: lockChoiceOrder.settings &&
                    toggle(lockChoiceOrder.label),
                  'feedback.enabled': feedback.settings &&
                    toggle(feedback.label, true)
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true),
                  'studentInstructions.enabled': studentInstructions.settings &&
                    toggle(studentInstructions.label, true),
                  'rationale.enabled': rationale.settings &&
                    toggle(rationale.label, true),
                  scoringType: scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric']),
                },
              }}
            />
          }
        >
          <div>
            {partLabels.enabled && <p>{`Part ${typeIsNumber ? '1' : 'A'}`}</p>}
            <ebsr-multiple-choice-configure
              id="A"
              key="partA"
              ref={ref => {
                if (ref) {
                  this.partA = ref;
                  this.partA.model = this.state.model.partA;
                  this.partA.configuration = configuration;
                }
              }}
            />

            {partLabels.enabled && <p>{`Part ${typeIsNumber ? '2' : 'B'}`}</p>}
            <ebsr-multiple-choice-configure
              id="B"
              key="partB"
              ref={ref => {
                if (ref) {
                  this.partB = ref;
                  this.partB.model = this.state.model.partB;
                  this.partB.configuration = configuration;
                }
              }}
            />
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
