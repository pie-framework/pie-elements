import React from 'react';
import {
  NumberTextField,
  InputCheckbox,
  FeedbackSelector,
  InputContainer
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';

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

  toggleMath = event => {
    const { onChange } = this.props;
    const model = this.applyUpdate({ showMathInput: event.target.checked });
    onChange(model);
  };

  changeFeedback = feedback => {
    const { model, onChange } = this.props;
    const update = { ...model, feedback };
    onChange(update);
  };

  render() {
    const { model, classes } = this.props;
    return (
      <div>
        <Typography className={classes.header} variant="subheading">
          Display
        </Typography>
        <NumberTextField
          label="Width (px)"
          disabled={!this.state.setDimensions}
          value={parseInt(model.width)}
          min={100}
          max={500}
          onChange={this.changeWidth}
        />
        <NumberTextField
          label="Height (px)"
          disabled={!this.state.setDimensions}
          value={parseInt(model.height)}
          min={100}
          max={500}
          onChange={this.changeHeight}
        />
        <br />
        <InputCheckbox
          label={'Student responses can include math notation'}
          onChange={this.toggleMath}
          checked={!!model.showMathInput}
        />
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
  }
}))(Main);
