import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { chartTypes, ConfigureChartPanel } from '@pie-lib/charting';
import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/editable-html';

import ChartingConfig from './charting-config';
import CorrectResponse from './correct-response';
import { applyConstraints, getGridValues, getLabelValues } from './utils';


const log = debug('@pie-element:graphing:configure');
const { Panel, toggle, radio } = settings;

const styles = (theme) => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  content: {
    marginTop: theme.spacing.unit * 2,
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
});

const charts = [
  chartTypes.Bar(),
  chartTypes.Histogram(),
  chartTypes.LineDot(),
  chartTypes.LineCross(),
  chartTypes.DotPlot(),
  chartTypes.LinePlot(),
];

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    imageSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { range, graph } = props.model || {};

    const gridValues = {
      range: getGridValues(range, graph.height, true)
    };

    const labelValues = {
      range: getLabelValues(range.step || 1)
    };

    this.state = { gridValues, labelValues };
  };

  static defaultProps = { classes: {} };

  onRationaleChange = (rationale) =>
    this.props.onModelChanged({ ...this.props.model, rationale });

  onPromptChange = (prompt) =>
    this.props.onModelChanged({ ...this.props.model, prompt });

  onTeacherInstructionsChange = (teacherInstructions) =>
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });

  onChartTypeChange = (chartType) =>
    this.props.onModelChanged({ ...this.props.model, chartType });

  onConfigChange = config => {
    const { model } = this.props;
    const { gridValues: oldGridValues, labelValues: oldLabelValues } = this.state;
    const updatedModel = { ...model, ...config };
    const { graph, range } = updatedModel;
    const gridValues = {};
    const labelValues = {};

    const rangeConstraints = applyConstraints(range, graph.height, oldGridValues.range, oldLabelValues.range);

    gridValues.range = rangeConstraints.gridValues;
    labelValues.range = rangeConstraints.labelValues;

    this.setState({ gridValues, labelValues });
    this.props.onModelChanged(updatedModel);
  };

  render() {
    const {
      classes,
      model,
      configuration,
      onConfigurationChanged,
      onModelChanged,
      imageSupport,
    } = this.props;
    log('[render] model', model);
    const { graph } = model;
    const {
      rationale = {},
      scoringType = {},
      studentInstructions = {},
      teacherInstructions = {},
      prompt = {},
      spellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {},
      chartDimensions = {},
      pieApi
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled, spellCheckEnabled } =
      model || {};
    const { gridValues, labelValues } = this.state;
    const showPixeGuides = chartDimensions.showInConfigPanel || true;

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Properties: {
                teacherInstructionsEnabled:
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label),
                studentInstructionsEnabled:
                  studentInstructions.settings &&
                  toggle(studentInstructions.label),
                rationaleEnabled: rationale.settings && toggle(rationale.label),
                spellCheckEnabled:
                  spellCheck.settings && toggle(spellCheck.label),
                promptEnabled: prompt.settings && toggle(prompt.label),
                scoringType:
                  scoringType.settings &&
                  radio(scoringType.label, [
                    'all or nothing',
                    'partial scoring',
                  ]),
              },
            }}
          />
        }
      >
        <div className={classes.content}>
          <Typography component="div" type="body1">
            <span>
              This item type provides various types of interactive charts. Depending upon how an item is configured, students can change the heights of bars (or other similar chart elements) created by the author; relabel bars created by the author; and/or add new bars, label them, and set their heights.
            </span>
          </Typography>

          {teacherInstructionsEnabled && (
            <InputContainer
              label={teacherInstructions.label}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.onTeacherInstructionsChange}
                imageSupport={imageSupport}
                nonEmpty={false}
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
                maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
                pieApi={pieApi}
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
                nonEmpty={false}
                spellCheck={spellCheckEnabled}
                disableUnderline
                maxImageWidth={defaultImageMaxWidth}
                maxImageHeight={defaultImageMaxHeight}
                pieApi={pieApi}
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
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxImageWidth && maxImageWidth.rationale || defaultImageMaxWidth}
                maxImageHeight={maxImageHeight && maxImageHeight.rationale || defaultImageMaxHeight}
                pieApi={pieApi}
              />
            </InputContainer>
          )}

          <ConfigureChartPanel
            model={model}
            onChange={this.onConfigChange}
            gridValues={gridValues}
            labelValues={labelValues}
            chartDimensions={chartDimensions}
            charts={charts}
          />

          <ChartingConfig
            model={model}
            onChange={onModelChanged}
            charts={charts}
            showPixelGuides={showPixeGuides}
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
