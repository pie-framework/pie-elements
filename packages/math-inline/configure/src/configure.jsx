import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  FeedbackConfig,
  settings,
  layout
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';
import { ResponseTypes } from './utils';

const log = debug('@pie-element:math-inline:configure');
const { Panel, toggle, radio } = settings;

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
  }
});

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    imageSupport: PropTypes.object
  };

  onChange = model => {
    this.props.onModelChanged(model);
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  render() {
    const { classes, model, imageSupport, onModelChanged } = this.props;
    const {
      configure: {
        responseType,
        teacherInstructions,
        studentInstructions,
        rationale,
        scoringType
      }
    } = model;
    log('[render] model', model);


    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            onChangeModel={model => onModelChanged(model)}
            groups={{
              'Item Type': {
                responseType: responseType.settings &&
                radio(responseType.label, [ResponseTypes.simple, ResponseTypes.advanced])
              },
              'Properties': {
                'configure.teacherInstructions.enabled': teacherInstructions.settings &&
                toggle(teacherInstructions.label),
                'configure.studentInstructions.enabled': studentInstructions.settings &&
                toggle(studentInstructions.label),
                'configure.rationale.enabled': rationale.settings &&
                toggle(rationale.label),
                scoringType: scoringType.settings &&
                radio(scoringType.label, ['auto', 'rubric']),
              },
            }}
          />
        }
      >
        <div>
          <div className={classes.content}>
            <Typography component="div" type="body1">
            <span>
              In Inline Math, students need to fill in the blank for an equation or a mathematical expression.
              This interaction allows for exactly one correct answer.
            </span>
            </Typography>
            <GeneralConfigBlock
              imageSupport={imageSupport}
              model={model}
              onChange={this.onChange}
            />
            <FeedbackConfig
              feedback={model.feedback}
              onChange={this.onFeedbackChange}
            />
          </div>
        </div>
      </layout.ConfigLayout>
    );
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    imageSupport: PropTypes.object,
    onModelChanged: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    this.onModelChanged = m => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    };
  }

  render() {
    const { imageSupport } = this.props;
    const { model } = this.state;
    return (
      <ConfigureMain
        model={model}
        imageSupport={imageSupport}
        onModelChanged={this.onModelChanged}
      />
    );
  }
}

export default StateWrapper;
