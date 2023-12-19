import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { chartTypes, ConfigureChartPanel } from '@pie-lib/pie-toolbox/charting';
import { settings, layout, InputContainer } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/pie-toolbox/editable-html';

import ChartingConfig from './charting-config';
import CorrectResponse from './correct-response';
import { applyConstraints, getGridValues, getLabelValues } from './utils';

const log = debug('@pie-element:graphing:configure');
const { Panel, toggle, radio, dropdown, textField } = settings;

const styles = (theme) => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  description: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
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
    uploadSoundSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    chartingOptions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { range = {}, graph } = props.model || {};
    const gridValues = { range: getGridValues(range, graph.height, true) };
    const labelValues = { range: getLabelValues(range.step || 1) };

    this.state = { gridValues, labelValues };
  }

  static defaultProps = { classes: {} };

  onRationaleChange = (rationale) => this.props.onModelChanged({ ...this.props.model, rationale });

  onPromptChange = (prompt) => this.props.onModelChanged({ ...this.props.model, prompt });

  onTeacherInstructionsChange = (teacherInstructions) =>
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });

  onChartTypeChange = (chartType) => this.props.onModelChanged({ ...this.props.model, chartType });

  onConfigChange = (config) => {
    const { model, onModelChanged } = this.props;
    const { gridValues: oldGridValues, labelValues: oldLabelValues } = this.state;
    const updatedModel = { ...model, ...config };
    const { graph, range } = updatedModel;
    const gridValues = {};
    const labelValues = {};

    const rangeConstraints = applyConstraints(range, graph.height, oldGridValues.range, oldLabelValues.range);

    gridValues.range = rangeConstraints.gridValues;
    labelValues.range = rangeConstraints.labelValues;

    this.setState({ gridValues, labelValues });
    onModelChanged(updatedModel);
  };

  render() {
    const { classes, configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;

    log('[render] model', model);

    const { graph } = model;
    const {
      contentDimensions = {},
      chartDimensions = {},
      authorNewCategoryDefaults = {},
      labelsPlaceholders = {},
      instruction = {},
      maxImageWidth = {},
      maxImageHeight = {},
      prompt = {},
      rationale = {},
      scoringType = {},
      settingsPanelDisabled,
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      titlePlaceholder = {},
      withRubric = {},
      chartingOptions = {},
      availableChartTypes = {},
      mathMlOptions = {},
      chartTypeLabel,
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      errors,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      studentNewCategoryDefaultLabel,
    } = model || {};
    const {
      categoryErrors,
      correctAnswerErrors,
      prompt: promptError,
      rationale: rationaleError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};
    const { gridValues, labelValues } = this.state;
    const showPixeGuides = chartDimensions.showInConfigPanel || true;

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelItemType = {
      changeInteractiveEnabled:
        chartingOptions.changeInteractive?.settings && toggle(chartingOptions.changeInteractive.settingsLabel),
      changeEditableEnabled:
        chartingOptions.changeEditable?.settings && toggle(chartingOptions.changeEditable.settingsLabel),
      changeAddCategoryEnabled:
        chartingOptions.addCategory?.settings && toggle(chartingOptions.addCategory.settingsLabel),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['all or nothing', 'partial scoring']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
      instruction: instruction.settings && textField(instruction.label),
    };

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelItemType,
              Properties: panelProperties,
            }}
          />
        }
      >
        <Typography component="div" type="body1" className={classes.description}>
          {instruction?.label || ''}
        </Typography>

        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={promptError}
              spellCheck={spellCheckEnabled}
              disableUnderline
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <ConfigureChartPanel
          model={model}
          onChange={this.onConfigChange}
          gridValues={gridValues}
          labelValues={labelValues}
          chartDimensions={chartDimensions}
          charts={charts}
          studentNewCategoryDefaultLabel={studentNewCategoryDefaultLabel}
          availableChartTypes={availableChartTypes}
          chartTypeLabel={chartTypeLabel}
        />

        <ChartingConfig
          model={model}
          onChange={onModelChanged}
          charts={charts}
          labelsPlaceholders={labelsPlaceholders}
          titlePlaceholder={titlePlaceholder}
          showPixelGuides={showPixeGuides}
          authorNewCategoryDefaults={authorNewCategoryDefaults}
          chartingOptions={chartingOptions}
          mathMlOptions={mathMlOptions}
        />

        <CorrectResponse
          config={graph}
          model={model}
          onChange={onModelChanged}
          charts={charts}
          error={categoryErrors}
          correctAnswerErrors={correctAnswerErrors}
          studentNewCategoryDefaultLabel={studentNewCategoryDefaultLabel}
          mathMlOptions={mathMlOptions}
        />

        {rationaleEnabled && (
          <InputContainer label={rationale.label || 'Rationale'} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChange}
              imageSupport={imageSupport}
              error={rationaleError}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);
