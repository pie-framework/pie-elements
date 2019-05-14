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

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
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
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged } = this.props;
    const {
      responseType,
      teacherInstructions,
      studentInstructions,
      rationale,
      scoringType
    } = configuration;
    log('[render] model', model);


    return (
      <div>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              configuration={configuration}
              onChangeModel={model => onModelChanged(model)}
              onChangeConfiguration={config => onConfigurationChanged(config)}
              groups={{
                'Item Type': {
                  responseType: responseType.settings &&
                    radio(responseType.label, [ResponseTypes.simple, ResponseTypes.advanced])
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true),
                  'studentInstructions.enabled': studentInstructions.settings &&
                    toggle(studentInstructions.label, true),
                  'rationale.enabled': rationale.settings &&
                    toggle(rationale.label, true),
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
                configuration={configuration}
                onChange={this.onChange}
              />
              <FeedbackConfig
                feedback={model.feedback}
                onChange={this.onFeedbackChange}
              />
            </div>
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

export default withStyles(styles)(Configure);
