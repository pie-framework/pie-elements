import React from 'react';
import {
  NumberTextField,
  InputCheckbox,
  LegacyFeedbackSelector
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import cloneDeep from 'lodash/cloneDeep';
const defaultFeedback = {
  type: 'default',
  feedback: 'Your answer has been submitted'
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
    this.changeWidth = this.change('expectedLength');
    this.changeHeight = this.change('expectedLines');
  }

  change = key => (event, v) => {
    const { onChange } = this.props;
    const model = this.updateConfig({ [key]: v });
    onChange(model);
  };

  updateConfig(update) {
    const { model } = this.props;
    const out = cloneDeep(model);
    out.model.config = { ...out.model.config, ...update };
    return out;
  }

  toggleMath = event => {
    const { onChange } = this.props;
    const model = this.updateConfig({ showMathInput: event.target.checked });
    onChange(model);
  };

  changeFeedback = feedback => {
    const { model, onChange } = this.props;
    const innerModel = { ...model.model, feedback };
    const update = { ...model, model: innerModel };
    onChange(update);
  };

  render() {
    const { model, classes } = this.props;
    const { config } = model.model;
    return (
      <div>
        <Typography className={classes.header} variant="subheading">
          Display
        </Typography>
        <NumberTextField
          label="Width (Columns)"
          disabled={!this.state.setDimensions}
          value={parseInt(config.expectedLength)}
          min={35}
          max={70}
          onChange={this.changeWidth}
        />
        <NumberTextField
          label="Height (Rows)"
          disabled={!this.state.setDimensions}
          value={parseInt(config.expectedLines)}
          min={3}
          max={10}
          onChange={this.changeHeight}
        />
        <br />
        <InputCheckbox
          label={'Student responses can include math notation'}
          onChange={this.toggleMath}
          checked={!!model.mathEnabled}
        />

        <Typography className={classes.header} variant="subheading">
          Feedback
        </Typography>

        <LegacyFeedbackSelector
          label="When submitted, show"
          feedback={model.feedback || defaultFeedback}
          onFeedbackChange={this.changeFeedback}
        />
      </div>
    );
  }
}
export default withStyles(theme => ({
  header: {
    paddingBottom: theme.spacing.unit
  }
}))(Main);
