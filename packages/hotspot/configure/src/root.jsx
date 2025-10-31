import React from 'react';
import { settings, layout, InputContainer, NumberTextField } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import Info from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import HotspotPalette from './hotspot-palette';
import HotspotContainer from './hotspot-container';
import { updateImageDimensions, generateValidationMessage, getUpdatedShapes, getAllShapes, groupShapes } from './utils';

const { Panel, toggle, dropdown } = settings;

export class Root extends React.Component {
  handleColorChange = (fieldType, color) => {
    const { onColorChanged } = this.props;
    const cType = `${fieldType}Color`;

    onColorChanged(cType, color);
  };

  handleOnUpdateImageDimensions = (value, resizeType) => {
    const {
      model: { dimensions, shapes },
      configuration: { preserveAspectRatio = {} },
      onUpdateImageDimension,
      onUpdateShapes,
    } = this.props;

    const nextImageDimensions = { ...dimensions, [resizeType]: value };

    // if preserveAspectRatio.enabled, updateImageDimensions function makes sure aspect ratio is kept
    const updatedDimensions = updateImageDimensions(
      dimensions,
      nextImageDimensions,
      preserveAspectRatio.enabled,
      resizeType,
    );
    // transform shapes map into shapes array
    const shapesArray = getAllShapes(shapes);
    // transform all the shapes to fit the re-sized image
    const updatedShapes = getUpdatedShapes(dimensions, updatedDimensions, shapesArray);
    // transform shapes array back into shapes map

    onUpdateShapes(groupShapes(updatedShapes));
    onUpdateImageDimension(updatedDimensions);
  };

  render() {
    const {
      classes,
      configuration,
      model,
      imageSupport,
      uploadSoundSupport,
      onConfigurationChanged,
      onImageUpload,
      onModelChangedByConfig,
      onPromptChanged,
      onRationaleChanged,
      onUpdateImageDimension,
      onTeacherInstructionsChanged,
      onUpdateShapes,
    } = this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      maxImageWidth = {},
      maxImageHeight = {},
      multipleCorrect = {},
      partialScoring = {},
      preserveAspectRatio = {},
      prompt = {},
      rationale = {},
      settingsPanelDisabled,
      spellCheck = {},
      teacherInstructions = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      errors,
      extraCSSRules,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};
    const {
      prompt: promptError,
      rationale: rationaleError,
      shapes: shapesError,
      selections: selectionsError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const panelSettings = {
      multipleCorrect: multipleCorrect.settings && toggle(multipleCorrect.label),
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };
    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            onChangeModel={onModelChangedByConfig}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptContainer}>
            <EditableHtml
              markup={model.teacherInstructions || ''}
              onChange={onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
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
          <InputContainer label={prompt.label} className={classes.promptContainer}>
            <EditableHtml
              markup={model.prompt || ''}
              onChange={onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <div className={classes.flexContainer}>
          <Typography className={classes.subheading} variant="subheading">
            Define Hotspot
          </Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableFocusListener
            disableTouchListener
            placement={'left'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} style={{ float: 'right' }} />
          </Tooltip>
        </div>

        <HotspotPalette
          hotspotColor={model.hotspotColor}
          hotspotList={model.hotspotList}
          outlineColor={model.outlineColor}
          outlineList={model.outlineList}
          onHotspotColorChange={(color) => this.handleColorChange('hotspot', color)}
          onOutlineColorChange={(color) => this.handleColorChange('outline', color)}
        />

        <HotspotContainer
          dimensions={model.dimensions}
          imageUrl={model.imageUrl}
          multipleCorrect={model.multipleCorrect}
          hasErrors={!!shapesError || !!selectionsError}
          hotspotColor={model.hotspotColor}
          outlineColor={model.outlineColor}
          selectedHotspotColor={model.selectedHotspotColor}
          hoverOutlineColor={model.hoverOutlineColor}
          onUpdateImageDimension={onUpdateImageDimension}
          onUpdateShapes={onUpdateShapes}
          onImageUpload={onImageUpload}
          shapes={model.shapes}
          strokeWidth={model.strokeWidth}
          preserveAspectRatioEnabled={preserveAspectRatio.enabled}
          insertImage={imageSupport && imageSupport.add}
        />
        {shapesError && <div className={classes.errorText}>{shapesError}</div>}
        {selectionsError && <div className={classes.errorText}>{selectionsError}</div>}

        {model.imageUrl && (
          <React.Fragment>
            <Typography variant="subheading">Image Dimensions</Typography>

            <div className={classes.dimensions}>
              <NumberTextField
                key="hotspot-manual-width"
                label="Width"
                value={model.dimensions.width}
                min={0}
                onChange={(e, value) => this.handleOnUpdateImageDimensions(value, 'width')}
                showErrorWhenOutsideRange
                className={classes.field}
              />

              <NumberTextField
                key="hotspot-manual-height"
                label="Height"
                value={model.dimensions.height}
                min={0}
                onChange={(e, value) => this.handleOnUpdateImageDimensions(value, 'height')}
                showErrorWhenOutsideRange
                className={classes.field}
              />
            </div>
          </React.Fragment>
        )}

        {rationaleEnabled && (
          <InputContainer label={rationale.label} className={classes.promptContainer}>
            <EditableHtml
              markup={model.rationale || ''}
              onChange={onRationaleChanged}
              imageSupport={imageSupport}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(rationale?.inputConfiguration)}
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

const styles = (theme) => ({
  dimensions: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 1.5,
  },
  field: {
    flex: 1,
    width: '90%',
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  subheading: {
    marginRight: theme.spacing.unit,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  configuration: PropTypes.object,
  model: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func,
  }),
  uploadSoundSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func,
  }),
  onImageUpload: PropTypes.func.isRequired,
  onColorChanged: PropTypes.func.isRequired,
  onPromptChanged: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  onModelChangedByConfig: PropTypes.func.isRequired,
  onRationaleChanged: PropTypes.func.isRequired,
  onConfigurationChanged: PropTypes.func.isRequired,
  onTeacherInstructionsChanged: PropTypes.func.isRequired,
};

export default withStyles(styles)(Root);
