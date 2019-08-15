import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/editable-html';
import GraphingConfig from './graphing-config';
import CorrectResponse from './correct-response';
import { tools } from '@pie-lib/graphing';

const { Panel, toggle, radio, numberFields } = settings;
const log = debug('@pie-element:graphing:configure');

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  }
});

const toolsArr = [
  tools.point(),
  tools.circle(),
  tools.polygon(),
  tools.segment(),
  tools.vector(),
  tools.ray(),
  tools.line(),
  tools.sine(),
  tools.parabola()
];

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    imageSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired
  };

  static defaultProps = { classes: {} };

  onRationaleChange = rationale => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, rationale });
  };

  onPromptChange = prompt => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, prompt });
  };

  onTeacherInstructionsChange = teacherInstructions => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, teacherInstructions });
  };

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      onModelChanged,
      imageSupport
    } = this.props;
    const config = model.graph;

    const {
      arrows = {},
      title = {},
      padding = {},
      labels = {},
      rationale = {},
      scoringType = {},
      studentInstructions = {},
      teacherInstructions = {},
      prompt = {},
      authoring = {}
    } = configuration || {};
    log('[render] model', model);

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              'Item Type': {
                arrows: arrows.settings && toggle(arrows.label),
                'title.enabled': title.settings && toggle(title.label, true),
                padding: padding.settings && toggle(padding.label),
                labels: labels.settings && toggle(labels.label),
                graph: numberFields('Graph Display Size', {
                  domain: {
                    label: 'Domain',
                    suffix: 'px',
                    min: 400,
                    max: 700
                  },
                  range: {
                    label: 'Range',
                    suffix: 'px',
                    min: 400,
                    max: 700
                  }
                })
              },
              Properties: {
                'authoring.enabled':
                  authoring.settings && toggle(authoring.label, true),
                'teacherInstructions.enabled':
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label, true),
                'studentInstructions.enabled':
                  studentInstructions.settings &&
                  toggle(studentInstructions.label, true),
                'rationale.enabled':
                  rationale.settings && toggle(rationale.label, true),
                scoringType:
                  scoringType.settings &&
                  radio(scoringType.label, ['dichotomous', 'partial scoring'])
              }
            }}
          />
        }
      >
        <div className={classes.content}>
          <Typography component="div" type="body1">
            <span>
              This interaction asks a student to draw a line that meets specific
              criteria. The student will draw the line by clicking on two points
              on the graph.
            </span>
          </Typography>

          {teacherInstructions.enabled && (
            <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.onTeacherInstructionsChange}
                imageSupport={imageSupport}
                nonEmpty={false}
              />
            </InputContainer>
          )}

          {prompt.settings && (
            <InputContainer
              label={prompt.label}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={this.onPromptChange}
                imageSupport={imageSupport}
                nonEmpty={!prompt.settings}
                disableUnderline
              />
            </InputContainer>
          )}

          {rationale.enabled && (
            <InputContainer
              label={rationale.label || 'Rationale'}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.rationale || ''}
                onChange={this.onRationaleChange}
                imageSupport={imageSupport}
              />
            </InputContainer>
          )}

          <GraphingConfig
            authoringEnabled={authoring && authoring.enabled}
            config={config}
            model={model}
            onChange={this.props.onModelChanged}
            tools={toolsArr}
          />

          <CorrectResponse
            config={config}
            model={model}
            onChange={this.props.onModelChanged}
            tools={toolsArr}
          />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);
