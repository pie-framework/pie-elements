import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import {
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout, choiceUtils as utils
} from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import merge from 'lodash/merge';

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
    model,
    configuration,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport,
    onChangeModel,
    onConfigurationChanged
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
            onChangeModel={onChangeModel}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              'Item Type': {
                'partLabels.enabled': partLabels.settings &&
                  toggle(partLabels.label, true),
                choiceMode:
                  choiceMode.settings &&
                  radio(choiceMode.label, ['checkbox', 'radio']),
                'sequentialChoiceLabels.enabled': sequentialChoiceLabels.settings &&
                  toggle(sequentialChoiceLabels.label, true),
                choicePrefix: choicePrefix.settings &&
                  radio(choicePrefix.label, ['numbers', 'letters']),
                partialScoring: partialScoring.settings &&
                  toggle(partialScoring.label),
              },
              'Properties': {
                'teacherInstructions.enabled': teacherInstructions.settings &&
                  toggle(teacherInstructions.label, true),
                'studentInstructions.enabled': studentInstructions.settings &&
                  toggle(studentInstructions.label, true),
                'rationale.enabled': rationale.settings &&
                  toggle(rationale.label, true),
                lockChoiceOrder: lockChoiceOrder.settings &&
                  toggle(lockChoiceOrder.label),
                scoringType: scoringType.settings &&
                  radio(scoringType.label, ['auto', 'rubric']),
              },
            }}
          />
        }
      >
        <div>
          {prompt.settings && (
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
          )}
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
          {addChoiceButton.settings && (
            <Button
              className={classes.addButton}
              variant="contained"
              color="primary"
              onClick={onAddChoice}
            >
              {addChoiceButton.label}
            </Button>
          )}
        </div>
      </layout.ConfigLayout>
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
    model.choices.push({
      label: 'label',
      value: utils.firstAvailableIndex(model.choices.map(c => c.value), 0),
      feedback: {
        type: 'none'
      }
    });

    this.props.onModelChanged(model);
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
      />);
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;