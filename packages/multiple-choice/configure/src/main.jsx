import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import {
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout
} from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const { Panel, toggle, radio } = settings;

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
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfiguration: {
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

const Design = withStyles(styles)(props => {
  const {
    classes,
    configuration,
    model,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport,
    onModelChanged
  } = props;
  const {
    prompt,
    addChoiceButton,
    feedback,
    deleteChoice,
    choiceMode,
    choicePrefix,
    partialScoring,
    lockChoiceOrder,
    teacherInstructions = {},
    studentInstructions = {},
    rationale = {},
    scoringType = {},
    sequentialChoiceLabels = {},
    partLabels = {},
  } = configuration;

  return (
    <div className={classes.design}>
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            onChange={onModelChanged}
            groups={{
              'Item Type': {
                'configuration.partLabels.enabled': partLabels.settings &&
                toggle(partLabels.label),
                choiceMode: choiceMode.settings &&
                radio(choiceMode.label, 'checkbox', 'radio'),
                'configuration.sequentialChoiceLabels.enabled': sequentialChoiceLabels.settings &&
                toggle(sequentialChoiceLabels.label),
                choicePrefix: choicePrefix.settings &&
                radio(choicePrefix.label, 'numbers', 'letters'),
                partialScoring: partialScoring.settings &&
                toggle(partialScoring.label),
              },
              'Properties': {
                'configuration.teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label),
                'configuration.studentInstructions.enabled': studentInstructions.settings &&
                toggle(studentInstructions.label),
                'configuration.rationale.enabled': rationale.settings &&
                toggle(rationale.label),
                lockChoiceOrder: lockChoiceOrder.settings &&
                toggle(lockChoiceOrder.label),
                scoringType: scoringType.settings &&
                radio(scoringType.label, 'auto', 'rubric'),
              },
            }}
          />
        }
      >
        <div>
          {prompt.settings &&
          <InputContainer
            label={prompt.label}
            className={classes.promptHolder}
          >
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={!prompt.settings}
              disableUnderline
            />
          </InputContainer>
          }
          {model.choices.map((choice, index) => (
            <ChoiceConfiguration
              key={index}
              index={index + 1}
              useLetterOrdering={model.choicePrefix === 'letters'}
              className={classes.choiceConfiguration}
              mode={model.choiceMode}
              data={choice}
              defaultFeedback={{}}
              imageSupport={imageSupport}
              onDelete={() => onRemoveChoice(index)}
              onChange={c => onChoiceChanged(index, c)}
              allowFeedBack={feedback.settings}
              allowDelete={deleteChoice.settings}
            />
          ))}
          <br />
          {
            addChoiceButton.settings &&
            <Button className={classes.addButton} variant="contained" color="primary" onClick={onAddChoice}>
              {addChoiceButton.label}
            </Button>
          }
        </div>
      </layout.ConfigLayout>
    </div>
  );
});

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onPromptChanged: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  onModelChanged = (model, key) => {
    const { updateModel } = this.props;

    switch (key) {
      case 'choiceMode': {
        let value = model.choiceMode;

        if (value === 'radio') {
          let correctFound = false;

          model.choices = model.choices.map(c => {
            if (correctFound) {
              c.correct = false;
              return c;
            }

            if (c.correct) {
              correctFound = true;
            }

            return c;
          });
        }
        updateModel(model, true);
        break;
      }
      default:
        updateModel(model);
        break;
    }
  }

  render() {
    return (
      <Design {...this.props} onModelChanged={this.onModelChanged} />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;

