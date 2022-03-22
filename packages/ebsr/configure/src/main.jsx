import React from 'react';
import PropTypes from 'prop-types';
import { settings, layout } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';

const { Panel, toggle, radio, dropdown } = settings;

const styles = theme => ({
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  part: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0 32px'
  }
});

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    configuration: PropTypes.object,
    model: PropTypes.object,
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func
  };

  removeExtraChoices = (choices) => {
    let correctFound = false;

     return (choices || []).map(choice => {
      if (correctFound) {
        choice.correct = false;
        return choice;
      }

      if (choice.correct) {
        correctFound = true;
      }

      return choice;
    });
  }

  onModelChanged = (model, key) => {
    const { onModelChanged } = this.props;

    if (key === 'partA.choiceMode' && model.partA.choiceMode === 'radio') {
      model.partA.choices = this.removeExtraChoices(model.partA.choices);

      return onModelChanged(model, true);
    }

    if (key === 'partB.choiceMode' && model.partB.choiceMode === 'radio') {
      model.partB.choices = this.removeExtraChoices(model.partB.choices);

      return onModelChanged(model, true);
    }

    return onModelChanged(model);
  }

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged
    } = this.props;
    const { partLabelType, partA: modelPartA, partB: modelPartB } = model;
    const { partA, partB, partialScoring, scoringType, ...generalConfiguration } = configuration;
    const {
      feedback: feedbackA = {},
      choiceMode: choiceModeA = {},
      choicePrefix: choicePrefixA = {},
      lockChoiceOrder: lockChoiceOrderA = {},
      prompt: promptA = {},
      teacherInstructions: teacherInstructionsA = {},
      studentInstructions: studentInstructionsA = {},
      choicesLayout: choicesLayoutA = {},
      gridColumns: gridColumnsA = {},
      rationale: rationaleA = {},
      spellCheck: spellCheckA = {}
    } = partA || {};
    const {
      feedback: feedbackB = {},
      choiceMode: choiceModeB = {},
      choicePrefix: choicePrefixB = {},
      lockChoiceOrder: lockChoiceOrderB = {},
      prompt: promptB = {},
      teacherInstructions: teacherInstructionsB = {},
      studentInstructions: studentInstructionsB = {},
      choicesLayout: choicesLayoutB = {},
      gridColumns: gridColumnsB = {},
      rationale: rationaleB = {},
      spellCheck: spellCheckB = {}
    } = partB || {};
    const type = partLabelType || 'Numbers';
    const typeIsNumber = type === 'Numbers';
    const firstPart = `Part ${typeIsNumber ? '1' : 'A'}`;
    const secondPart = `Part ${typeIsNumber ? '2' : 'B'}`;
    const nrOfColumnsAvailable = {
      partA: modelPartA.choices && modelPartA.choices.length ?
        Array.from({length: modelPartA.choices.length}, (_, i) => (`${i + 1}`)) : [],
      partB: modelPartB.choices && modelPartB.choices.length ?
        Array.from({length: modelPartB.choices.length}, (_, i) => (`${i + 1}`)) : [],
    };

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={this.onModelChanged}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                'Settings for both': {
                  partLabels:
                    generalConfiguration.partLabels.settings &&
                    toggle(generalConfiguration.partLabels.label),
                  partLabelType:
                    model.partLabels && dropdown('', ['Numbers', 'Letters']),
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  scoringType:
                    scoringType.settings && radio(scoringType.label, ['auto', 'rubric'])
                },
                [`Settings ${firstPart}`]: {
                  'partA.choiceMode':
                    choiceModeA.settings &&
                    radio(choiceModeA.label, ['checkbox', 'radio']),
                  'partA.choicePrefix':
                    choicePrefixA.settings &&
                    radio(choicePrefixA.label, ['numbers', 'letters']),
                  'partA.lockChoiceOrder':
                    lockChoiceOrderA.settings && toggle(lockChoiceOrderA.label),
                  'partA.choicesLayout':
                    choicesLayoutA.settings &&
                    dropdown(choicesLayoutA.label, ['vertical', 'grid', 'horizontal']),
                  'partA.gridColumns':
                    choicesLayoutA.settings && modelPartA.choicesLayout === 'grid' &&
                    nrOfColumnsAvailable.partA.length > 0 &&
                    dropdown(gridColumnsA.label, nrOfColumnsAvailable.partA)
                },
                [`Properties ${firstPart}`]: {
                  'partA.feedbackEnabled': feedbackA.settings &&
                    toggle(feedbackA.label),
                  'partA.promptEnabled':
                    promptA.settings && toggle(promptA.label),
                  'partA.teacherInstructionsEnabled':
                    teacherInstructionsA.settings &&
                    toggle(teacherInstructionsA.label),
                  'partA.studentInstructionsEnabled':
                    studentInstructionsA.settings &&
                    toggle(studentInstructionsA.label),
                  'partA.rationaleEnabled':
                    rationaleA.settings && toggle(rationaleA.label),
                    'partA.spellCheckEnabled':
                    spellCheckA.settings && toggle(spellCheckA.label),
                },
                [`Settings ${secondPart}`]: {
                  'partB.choiceMode':
                    choiceModeB.settings &&
                    radio(choiceModeB.label, ['checkbox', 'radio']),
                  'partB.choicePrefix':
                    choicePrefixB.settings &&
                    radio(choicePrefixB.label, ['numbers', 'letters']),
                  'partB.lockChoiceOrder':
                    lockChoiceOrderB.settings && toggle(lockChoiceOrderB.label),
                  'partB.choicesLayout':
                    choicesLayoutB.settings &&
                    dropdown(choicesLayoutB.label, ['vertical', 'grid', 'horizontal']),
                  'partB.gridColumns':
                    choicesLayoutB.settings && modelPartB.choicesLayout === 'grid' &&
                    nrOfColumnsAvailable.partB.length > 0 &&
                    dropdown(gridColumnsB.label, nrOfColumnsAvailable.partB)
                },
                [`Properties ${secondPart}`]: {
                  'partB.feedbackEnabled':
                    feedbackB.settings && toggle(feedbackB.label),
                  'partB.promptEnabled':
                    promptB.settings && toggle(promptB.label),
                  'partB.teacherInstructionsEnabled':
                    teacherInstructionsB.settings &&
                    toggle(teacherInstructionsB.label),
                  'partB.studentInstructionsEnabled':
                    studentInstructionsB.settings &&
                    toggle(studentInstructionsB.label),
                  'partB.rationaleEnabled':
                    rationaleB.settings && toggle(rationaleB.label),
                    'partB.spellCheckEnabled':
                    spellCheckB.settings && toggle(spellCheckB.label),
                }
              }}
            />
          }
        >
          <div>
            <div className={classes.part}>
              {model.partLabels && <p>{firstPart}</p>}
              <ebsr-multiple-choice-configure
                id="A"
                key="partA"
                ref={ref => {
                  if (ref) {
                    // do not use destructuring to get model from props
                    this.partA = ref;
                    this.partA._model = cloneDeep(this.props.model.partA);
                    this.partA.configuration = {
                      ...partA,
                      ...generalConfiguration
                    };
                  }
                }}
              />
            </div>

            <div className={classes.part}>
              {model.partLabels && <p>{secondPart}</p>}
              <ebsr-multiple-choice-configure
                id="B"
                key="partB"
                ref={ref => {
                  if (ref) {
                    // do not use destructuring to get model from props
                    this.partB = ref;
                    this.partB._model = cloneDeep(this.props.model.partB);
                    this.partB.configuration = {
                      ...partB,
                      ...generalConfiguration
                    };
                  }
                }}
              />
            </div>
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
