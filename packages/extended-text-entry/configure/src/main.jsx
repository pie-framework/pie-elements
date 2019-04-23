import React from 'react';
import {
  NumberTextField,
  FeedbackSelector,
  InputContainer,
  settings,
  layout
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle } = settings;

const defaultFeedback = {
  type: 'default',
  default: 'Your answer has been submitted'
};

export class Main extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      setDimensions: true
    };
    this.changeWidth = this.change('width');
    this.changeHeight = this.change('height');
  }

  change = key => (event, v) => {
    const { onChange } = this.props;
    const model = this.applyUpdate({ [key]: v });
    onChange(model);
  };

  onPromptChange = markup => {
    const { onChange } = this.props;
    const model = this.applyUpdate({ prompt: markup });
    onChange(model);
  };

  applyUpdate(update) {
    const { model } = this.props;
    const out = Object.assign({}, model, update);
    return out;
  }

  changeFeedback = feedback => {
    const { model, onChange } = this.props;
    const update = { ...model, feedback };
    onChange(update);
  };

  render() {
    const { model, classes, onChange } = this.props;
    const {
      configure: {
        equationEditor,
        multipleParts,
        teacherInstructions,
        studentInstructions,
        mathInput,
        width,
        height
      },
    } = model;

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            onChange={model => onChange(model)}
            groups={{
              'Item Type': {
                mathInput: mathInput.settings && toggle(mathInput.label),
                'configure.equationEditor.enabled': equationEditor.settings &&
                toggle(equationEditor.label),
                'configure.multipleParts.enabled': multipleParts.settings &&
                toggle(multipleParts.label),
              },
              'Properties': {
                'configure.teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label),
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

          {width.settings &&
            <NumberTextField
              label={width.label}
              disabled={!this.state.setDimensions}
              value={parseInt(model.width)}
              min={100}
              max={500}
              onChange={this.changeWidth}
              showErrorWhenOutsideRange
              className={classes.field}
            />
          }
          {
            height.settings &&
              <NumberTextField
                label={height.label}
                disabled={!this.state.setDimensions}
                value={parseInt(model.height)}
                min={100}
                max={500}
                onChange={this.changeHeight}
                showErrorWhenOutsideRange
                className={classes.field}
              />
          }
          <br />
          <InputContainer label="Prompt" className={classes.promptContainer}>
            <EditableHtml markup={model.prompt} onChange={this.onPromptChange} />
          </InputContainer>

          <Typography className={classes.header} variant="subheading">
            Feedback
          </Typography>

          <FeedbackSelector
            label="When submitted, show"
            feedback={model.feedback || defaultFeedback}
            onChange={this.changeFeedback}
          />
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
