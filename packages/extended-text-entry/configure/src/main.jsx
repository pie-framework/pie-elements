import React from 'react';
import {
  FeedbackSelector,
  InputContainer,
  settings,
  layout,
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';

const { Panel, toggle, numberFields, dropdown } = settings;

const defaultFeedback = {
  type: 'default',
  default: 'Your answer has been submitted',
};

export class Main extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      setDimensions: true,
    };
  }

  onPromptChange = (markup) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({
      ...model,
      prompt: markup,
    });
  };

  changeFeedback = (feedback) => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, feedback };
    onModelChanged(update);
  };

  changeTeacherInstructions = (teacherInstructions) => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, teacherInstructions };
    onModelChanged(update);
  };

  render() {
    const {
      model,
      classes,
      onModelChanged,
      configuration,
      onConfigurationChanged,
      imageSupport,
    } = this.props;
    const {
      multiple = {},
      feedback = {},
      teacherInstructions = {},
      prompt = {},
      studentInstructions = {},
      mathInput = {},
      spanishInput = {},
      specialInput = {},
      dimensions = {},
      equationEditor = {},
      spellCheck = {},
      playerSpellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {}
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, feedbackEnabled, spellCheckEnabled } =
      model || {};
    const toolbarOpts = {};

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }
    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={(config) => onConfigurationChanged(config)}
            groups={{
              Settings: {
                mathInput: mathInput.settings && toggle(mathInput.label),
                equationEditor:
                  equationEditor.enabled &&
                  model.mathInput &&
                  dropdown(equationEditor.label, [
                    'non-negative-integers',
                    'integers',
                    'decimals',
                    'fractions',
                    'Grade 1 - 2',
                    'Grade 3 - 5',
                    'Grade 6 - 7',
                    'Grade 8 - HS',
                    'geometry',
                    'advanced-algebra',
                    'statistics',
                    'item-authoring',
                  ]),
                spanishInput: spanishInput.settings && toggle(spanishInput.label),
                specialInput: specialInput.settings && toggle(specialInput.label),
                dimensions: numberFields(dimensions.label, {
                  width: {
                    label: 'Width (px)',
                    suffix: 'px',
                    min: 100,
                    max: 500,
                  },
                  height: {
                    label: 'Height (px)',
                    suffix: 'px',
                    min: 100,
                    max: 500,
                  },
                }),
                'multiple.enabled':
                  multiple.settings && toggle(multiple.label, true),
                promptEnabled: prompt.settings && toggle(prompt.label),
                feedbackEnabled: feedback.settings && toggle(feedback.label),
                spellCheckEnabled:
                spellCheck.settings && toggle(spellCheck.label),
                playerSpellCheckEnabled:
                playerSpellCheck.settings && toggle(playerSpellCheck.label),
              },
              Properties: {
                teacherInstructionsEnabled:
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label),
                studentInstructionsEnabled:
                  studentInstructions.settings &&
                  toggle(studentInstructions.label),
              },
            }}
          />
        }
      >
        <div>
          {teacherInstructionsEnabled && (
            <InputContainer
              label={teacherInstructions.label}
              className={classes.promptContainer}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.changeTeacherInstructions}
                imageSupport={imageSupport}
                nonEmpty={false}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
                maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
              />
            </InputContainer>
          )}

          <br />

          {promptEnabled && (
            <InputContainer
              label={prompt.label}
              className={classes.promptContainer}
            >
              <EditableHtml
                activePlugins={ALL_PLUGINS}
                className={classes.prompt}
                markup={model.prompt || ''}
                onChange={this.onPromptChange}
                imageSupport={imageSupport}
                nonEmpty={false}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={defaultImageMaxWidth}
                maxImageHeight={defaultImageMaxHeight}
              />
            </InputContainer>
          )}

          {feedbackEnabled && (
            <React.Fragment>
              <Typography className={classes.header} variant="subheading">
                Feedback
              </Typography>

              <FeedbackSelector
                label="When submitted, show"
                feedback={model.feedback || defaultFeedback}
                onChange={this.changeFeedback}
                toolbarOpts={toolbarOpts}
              />
            </React.Fragment>
          )}
        </div>
      </layout.ConfigLayout>
    );
  }
}
export default withStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.unit,
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  promptInput: {
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  field: {
    width: '200px',
  },
}))(Main);
