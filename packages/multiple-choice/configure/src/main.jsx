import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import {
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout,
  choiceUtils as utils
} from '@pie-lib/config-ui';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import merge from 'lodash/merge';
import Tooltip from '@material-ui/core/Tooltip';

const { Panel, toggle, radio, dropdown } = settings;

const MAX_CHOICES = 9;

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
    width: '70%'
  },
  rationale: {
    paddingTop: theme.spacing.unit * 2
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
  },
  disableButton: {
    cursor: 'not-allowed',
    pointerEvents: 'all',
    backgroundColor: color.disabled(),
    '&:hover': {
      backgroundColor: color.disabled(),
    },
    '&:focus': {
      backgroundColor: color.disabled(),
    }
  }
});

const Design = withStyles(styles)(props => {
  const {
    classes,
    model,
    configuration,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged
  } = props;
  const {
    prompt = {},
    addChoiceButton = {},
    limitChoicesNumber = {},
    feedback = {},
    deleteChoice = {},
    choiceMode = {},
    choicePrefix = {},
    partialScoring = {},
    lockChoiceOrder = {},
    teacherInstructions = {},
    studentInstructions = {},
    rationale = {},
    scoringType = {},
    sequentialChoiceLabels = {},
    settingsPanelDisabled,
    choicesLayout,
    gridColumns,
  } = configuration || {};
  const {
    limitChoicesNumber: limitChoicesNumberModel,
    teacherInstructionsEnabled,
    rationaleEnabled,
    feedbackEnabled,
    promptEnabled
  } = model || {};

  const nrOfColumnsAvailable = Array.from({length: model.choices.length}, (_, i) => i + 1);

  const Content = (
    <div>
      {teacherInstructionsEnabled && (
        <InputContainer
          label={teacherInstructions.label}
          className={classes.promptHolder}
        >
          <EditableHtml
            className={classes.prompt}
            markup={model.teacherInstructions || ''}
            onChange={onTeacherInstructionsChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
          />
        </InputContainer>
      )}

      {promptEnabled && (
        <InputContainer label={prompt.label} className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.prompt}
            onChange={onPromptChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
            disableUnderline
          />
        </InputContainer>
      )}
      {model.choices.map((choice, index) => (
        <div
          key={`choice-${index}`}
          className={classes.choiceConfigurationHolder}
        >
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
            allowFeedBack={feedbackEnabled}
            allowDelete={deleteChoice.settings}
            noLabels
          />
          {rationaleEnabled && (
            <InputContainer
              key={`rationale-${index}`}
              label={rationale.label}
              className={classes.rationaleHolder}
            >
              <EditableHtml
                className={classes.rationale}
                markup={choice.rationale || ''}
                onChange={c =>
                  onChoiceChanged(index, {
                    ...choice,
                    rationale: c
                  })
                }
                imageSupport={imageSupport}
              />
            </InputContainer>
          )}
        </div>
      ))}
      <br />
      {addChoiceButton.settings && (
        <Tooltip title={limitChoicesNumberModel && model.choices.length >= MAX_CHOICES ? `Only ${MAX_CHOICES} allowed maximum` : ''} classes={{ tooltip: classes.tooltip }}>
          <Button
            classes={{ root: limitChoicesNumberModel && model.choices.length >= MAX_CHOICES ? classes.disableButton : undefined }}
            className={classes.addButton}
            variant="contained"
            color="primary"
            onClick={onAddChoice}
          >
            {addChoiceButton.label}
          </Button>
        </Tooltip>
      )}
    </div>
  );

  return (
    <div className={classes.design}>
      {settingsPanelDisabled ? (
        Content
      ) : (
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onChangeModel}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  choiceMode:
                    choiceMode.settings &&
                    radio(choiceMode.label, ['checkbox', 'radio']),
                  'sequentialChoiceLabels.enabled':
                    sequentialChoiceLabels.settings &&
                    toggle(sequentialChoiceLabels.label, true),
                  choicePrefix:
                    choicePrefix.settings &&
                    radio(choicePrefix.label, ['numbers', 'letters']),
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  limitChoicesNumber:
                    limitChoicesNumber.settings && toggle(limitChoicesNumber.label),
                  lockChoiceOrder:
                    lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
                  feedbackEnabled: feedback.settings && toggle(feedback.label),
                  choicesLayout: choicesLayout.settings && dropdown(choicesLayout.label, ['vertical', 'grid', 'horizontal']),
                  gridColumns: model.choicesLayout === 'grid' && dropdown(gridColumns.label, nrOfColumnsAvailable),
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  studentInstructionsEnabled:
                    studentInstructions.settings &&
                    toggle(studentInstructions.label),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  scoringType:
                    scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric'])
                }
              }}
            />
          }
        >
          {Content}
        </layout.ConfigLayout>
      )}
    </div>
  );
});

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  onRemoveChoice = index => {
    const { model } = this.props;

    model.choices.splice(index, 1);
    this.props.onModelChanged(model);
  };

  onAddChoice = () => {
    const { model } = this.props;

    if (!model.limitChoicesNumber || (model.limitChoicesNumber && model.choices.length < MAX_CHOICES)) {
      model.choices.push({
        label: '',
        value: utils.firstAvailableIndex(model.choices.map(c => c.value), 0),
        feedback: {
          type: 'none'
        }
      });

      this.props.onModelChanged(model);
    }
  };

  onChoiceChanged = (index, choice) => {
    const { model } = this.props;

    if (choice.correct && model.choiceMode === 'radio') {
      model.choices = model.choices.map(c => {
        return merge({}, c, { correct: false });
      });
    }

    model.choices.splice(index, 1, choice);
    this.props.onModelChanged(model);
  };

  onPromptChanged = prompt => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt
    });
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions
    });
  };

  onModelChanged = (model, key) => {
    const { onModelChanged } = this.props;

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
        onModelChanged(model, true);
        break;
      }
      default:
        onModelChanged(model);
        break;
    }
  };

  render() {
    return (
      <Design
        {...this.props}
        onChangeModel={this.onModelChanged}
        onRemoveChoice={this.onRemoveChoice}
        onChoiceChanged={this.onChoiceChanged}
        onAddChoice={this.onAddChoice}
        onPromptChanged={this.onPromptChanged}
        onTeacherInstructionsChanged={this.onTeacherInstructionsChanged}
      />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
