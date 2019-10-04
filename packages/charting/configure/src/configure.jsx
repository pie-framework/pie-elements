import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { chartTypes } from '@pie-lib/charting';
import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/editable-html';

import ChartingConfig from './charting-config';
import CorrectResponse from './correct-response';
import ChartType from './chart-type';

const log = debug('@pie-element:graphing:configure');
const { Panel, toggle, radio, numberFields } = settings;

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

const charts = [
  chartTypes.Bar(),
  chartTypes.Histogram(),
  chartTypes.LineDot(),
  chartTypes.LineCross(),
  chartTypes.DotPlot(),
  chartTypes.LinePlot()
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

  onRationaleChange = rationale => this.props.onModelChanged({ ...this.props.model, rationale });

  onPromptChange = prompt => this.props.onModelChanged({ ...this.props.model, prompt });

  onTeacherInstructionsChange = teacherInstructions => this.props.onModelChanged({ ...this.props.model, teacherInstructions });

  onChartTypeChange = chartType => this.props.onModelChanged({ ...this.props.model, chartType });

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      onModelChanged,
      imageSupport
    } = this.props;
    log('[render] model', model);
    const { graph } = model;
    const {
      title = {},
      rationale = {},
      scoringType = {},
      studentInstructions = {},
      teacherInstructions = {},
      prompt = {},
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled } = model || {};

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
                'title.enabled': title.settings && toggle(title.label, true),
                graph: numberFields('Graph Display Size', {
                  width: {
                    label: 'Width',
                    suffix: 'px',
                    min: 400,
                    max: 700
                  },
                  height: {
                    label: 'Height',
                    suffix: 'px',
                    min: 400,
                    max: 700
                  }
                })
              },
              Properties: {
                teacherInstructionsEnabled:
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label),
                studentInstructionsEnabled:
                  studentInstructions.settings &&
                  toggle(studentInstructions.label),
                rationaleEnabled:
                  rationale.settings && toggle(rationale.label),
                promptEnabled:
                  prompt.settings && toggle(prompt.label),
                scoringType:
                  scoringType.settings &&
                  radio(scoringType.label, ['all or nothing', 'partial scoring'])
              }
            }}
          />
        }
      >
        <div className={classes.content}>
          <Typography component="div" type="body1">
            <span>
              This interaction asks a student to draw a chart that meets specific criteria.
              The student will draw a category on the chart by clicking Add Category
              and dragging the top part of the category.
            </span>
          </Typography>

          {teacherInstructionsEnabled && (
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

          {promptEnabled && (
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

          {rationaleEnabled && (
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

          <ChartType
            value={model.chartType}
            onChange={e => this.onChartTypeChange(e.target.value)}
          />

          <ChartingConfig
            config={graph}
            model={model}
            onChange={onModelChanged}
            charts={charts}
          />

          <CorrectResponse
            config={graph}
            model={model}
            onChange={onModelChanged}
            charts={charts}
          />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);
