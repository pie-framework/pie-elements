import React from 'react';
import {
  FeedbackSelector,
  InputContainer,
  settings,
  layout
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle, numberFields, dropdown } = settings;

const defaultFeedback = {
  type: 'default',
  default: 'Your answer has been submitted'
};

export class Main extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      setDimensions: true
    };
  }

  change = key => (event, v) => {
    const { onModelChanged } = this.props;
    const model = this.applyUpdate({ [key]: v });
    onModelChanged(model);
  };

  onPromptChange = markup => {
    const { onModelChanged } = this.props;
    const model = this.applyUpdate({ prompt: markup });
    onModelChanged(model);
  };

  applyUpdate(update) {
    const { model } = this.props;
    const out = Object.assign({}, model, update);
    return out;
  }

  changeFeedback = feedback => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, feedback };
    onModelChanged(update);
  };

  changeTeacherInstructions = teacherInstructions => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, teacherInstructions };
    onModelChanged(update);
  };

  render() {
    const { model, classes, onModelChanged, configuration, onConfigurationChanged, imageSupport } = this.props;
    const {
      multiple,
      feedback,
      teacherInstructions = {},
      studentInstructions,
      mathInput,
      dimensions,
      equationEditor
    } = configuration;

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={model => onModelChanged(model)}
            onChangeConfiguration={config => onConfigurationChanged(config)}
            groups={{
              'Settings': {
                mathInput: mathInput.settings && toggle(mathInput.label),
                equationEditor: equationEditor.enabled && model.mathInput && dropdown(equationEditor.label, [
                  'Grade 1 - 2',
                  'Grade 3 - 5',
                  'Grade 6 - 7',
                  'Grade 8 - HS',
                  'geometry',
                  'advanced-algebra',
                  'statistics',
                  'everything'
                ]),
                dimensions: numberFields(dimensions.label, {
                  width: {
                    label: 'Width (px)',
                    suffix: 'px',
                    min: 100,
                    max: 500
                  },
                  height: {
                    label: 'Height (px)',
                    suffix: 'px',
                    min: 100,
                    max: 500
                  }
                }),
                'multiple.enabled': multiple.settings &&
                toggle(multiple.label, true),
                'feedback.enabled': feedback.settings && toggle(feedback.label, true),
              },
              'Properties': {
                'teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label, true),
                'configure.studentInstructions.enabled': studentInstructions.settings &&
                toggle(studentInstructions.label),
              },
            }}
          />
        }
      >
        <div>
          <Typography className={classes.header} variant="subheading">
            Display
          </Typography>

          {teacherInstructions.enabled && (
            <InputContainer label={teacherInstructions.label} className={classes.promptContainer}>
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.changeTeacherInstructions}
                imageSupport={imageSupport}
                nonEmpty={false}
              />
            </InputContainer>
          )}

          <br />
          <InputContainer label="Prompt" className={classes.promptContainer}>
            <EditableHtml markup={model.prompt} onChange={this.onPromptChange} />
          </InputContainer>

          {
            feedback.enabled && (
              <React.Fragment>
                <Typography className={classes.header} variant="subheading">
                  Feedback
                </Typography>

                <FeedbackSelector
                  label="When submitted, show"
                  feedback={model.feedback || defaultFeedback}
                  onChange={this.changeFeedback}
                />
              </React.Fragment>
            )
          }
        </div>
      </layout.ConfigLayout>
    );
  }
}
export default withStyles(theme => ({
  header: {
    paddingBottom: theme.spacing.unit
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%'
  },
  promptInput: {
    width: '100%',
    marginBottom: theme.spacing.unit
  },
  field: {
    width: '200px'
  }
}))(Main);
