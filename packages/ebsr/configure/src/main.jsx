import React from 'react';
import PropTypes from 'prop-types';
import {
  settings,
  layout
} from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';

const { Panel, toggle, radio, dropdown } = settings;

const styles = theme => ({
  design: {
    paddingTop: theme.spacing.unit * 3
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

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      model: cloneDeep(props.model)
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
    const { partLabelType } = model;
    const { partA, partB, ...generalConfiguration } = configuration;
    const {
      feedback: feedbackA = {} ,
      choiceMode: choiceModeA = {},
      choicePrefix: choicePrefixA = {},
      partialScoring: partialScoringA = {},
      lockChoiceOrder: lockChoiceOrderA = {},
      teacherInstructions: teacherInstructionsA = {},
      studentInstructions: studentInstructionsA = {},
      rationale: rationaleA = {},
      scoringType: scoringTypeA = {},
      sequentialChoiceLabels: sequentialChoiceLabelsA = {},
    } = partA || {};
    const {
      feedback: feedbackB = {} ,
      choiceMode: choiceModeB = {},
      choicePrefix: choicePrefixB = {},
      partialScoring: partialScoringB = {},
      lockChoiceOrder: lockChoiceOrderB = {},
      teacherInstructions: teacherInstructionsB = {},
      studentInstructions: studentInstructionsB = {},
      rationale: rationaleB = {},
      scoringType: scoringTypeB = {},
      sequentialChoiceLabels: sequentialChoiceLabelsB = {},
    } = partB || {};
    const type = partLabelType || 'Numbers';
    const typeIsNumber = type === 'Numbers';
    const firstPart = `Part ${typeIsNumber ? '1' : 'A'}`;
    const secondPart = `Part ${typeIsNumber ? '2' : 'B'}`;

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onModelChanged}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                'Settings for both': {
                  partLabels: generalConfiguration.partLabels.settings &&
                    toggle(generalConfiguration.partLabels.label),
                  partLabelType: model.partLabels &&
                    dropdown('', ['Numbers', 'Letters'])
                },
                [`Settings ${firstPart}`]: {
                  'partA.choiceMode':
                    choiceModeA.settings &&
                    radio(choiceModeA.label, ['checkbox', 'radio']),
                  'partA.choicePrefix': choicePrefixA.settings &&
                    radio(choicePrefixA.label, ['numbers', 'letters']),
                  'partA.partialScoring': partialScoringA.settings &&
                    toggle(partialScoringA.label),
                  'partA.lockChoiceOrder': lockChoiceOrderA.settings &&
                    toggle(lockChoiceOrderA.label),
                  'partA.scoringType': scoringTypeA.settings &&
                    radio(scoringTypeA.label, ['auto', 'rubric'])
                },
                [`Properties ${firstPart}`]: {
                  'partA.sequentialChoiceLabels.enabled': sequentialChoiceLabelsA.settings &&
                    toggle(sequentialChoiceLabelsA.label, true),
                  'partA.feedbackEnabled': feedbackA.settings &&
                    toggle(feedbackA.label),
                  'partA.teacherInstructionsEnabled': teacherInstructionsA.settings &&
                    toggle(teacherInstructionsA.label),
                  'partA.studentInstructionsEnabled': studentInstructionsA.settings &&
                    toggle(studentInstructionsA.label),
                  'partA.rationaleEnabled': rationaleA.settings && toggle(rationaleA.label)
                },
                [`Settings ${secondPart}`]: {
                  'partB.choiceMode':
                    choiceModeB.settings &&
                    radio(choiceModeB.label, ['checkbox', 'radio']),
                  'partB.choicePrefix': choicePrefixB.settings &&
                    radio(choicePrefixB.label, ['numbers', 'letters']),
                  'partB.partialScoring': partialScoringB.settings &&
                    toggle(partialScoringB.label),
                  'partB.lockChoiceOrder': lockChoiceOrderB.settings &&
                    toggle(lockChoiceOrderB.label),
                  'partA.scoringType': scoringTypeB.settings &&
                    radio(scoringTypeB.label, ['auto', 'rubric'])
                },
                [`Properties ${secondPart}`]: {
                  'partB.sequentialChoiceLabels.enabled': sequentialChoiceLabelsB.settings &&
                    toggle(sequentialChoiceLabelsB.label, true),
                  'partB.feedbackEnabled': feedbackB.settings &&
                    toggle(feedbackB.label),
                  'partB.teacherInstructionsEnabled': teacherInstructionsB.settings &&
                    toggle(teacherInstructionsB.label),
                  'partB.studentInstructionsEnabled': studentInstructionsB.settings &&
                    toggle(studentInstructionsB.label),
                  'partB.rationaleEnabled': rationaleB.settings && toggle(rationaleB.label)
                }
              }}
            />
          }
        >
          <div>
            {model.partLabels && <p>{firstPart}</p>}
            <ebsr-multiple-choice-configure
              id="A"
              key="partA"
              ref={ref => {
                if (ref) {
                  // do not use destructuring to get model from state
                  this.partA = ref;
                  this.partA._model = cloneDeep(this.state.model.partA);
                  this.partA.configuration = {
                    ...partA,
                    ...generalConfiguration
                  };
                }
              }}
            />

            {model.partLabels && <p>{secondPart}</p>}
            <ebsr-multiple-choice-configure
              id="B"
              key="partB"
              ref={ref => {
                if (ref) {
                  // do not use destructuring to get model from state
                  this.partB = ref;
                  this.partB._model = cloneDeep(this.state.model.partB);
                  this.partB.configuration = {
                    ...partB,
                    ...generalConfiguration
                  };
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
