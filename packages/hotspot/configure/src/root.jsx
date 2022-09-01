import React from 'react';
import {
  settings,
  layout,
  InputContainer,
  NumberTextField
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import HotspotPalette from './hotspot-palette';
import HotspotContainer from './hotspot-container';
import classNames from 'classnames';
import {
  updateImageDimensions,
  generateValidationMessage,
  getUpdatedShapes,
  getAllShapes,
  groupShapes
} from './utils';

const { Panel, toggle } = settings;

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
      resizeType
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
      onConfigurationChanged,
      onImageUpload,
      onModelChangedByConfig,
      onPromptChanged,
      onRationaleChanged,
      onUpdateImageDimension,
      onTeacherInstructionsChanged,
      onUpdateShapes
    } = this.props;
    const {
      multipleCorrect = {},
      partialScoring = {},
      prompt = {},
      teacherInstructions = {},
      rationale = {},
      spellCheck = {},
      preserveAspectRatio = {},
      maxImageWidth = {},
      maxImageHeight = {},
      pieApi
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled, spellCheckEnabled, errors } = model || {};
    const { shapesError, selectionsError } = errors || {};
    const toolbarOpts = {};

    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }

    return (
      <div className={classes.base}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onModelChangedByConfig}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                'Settings': {
                  multipleCorrect:
                    multipleCorrect.settings && toggle(multipleCorrect.label),
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  promptEnabled:
                    prompt.settings && toggle(prompt.label),
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings && toggle(teacherInstructions.label),
                  rationaleEnabled: rationale.settings && toggle(rationale.label),
                  spellCheckEnabled:
                    spellCheck.settings && toggle(spellCheck.label),
                }
              }}
            />
          }
        >
          <div className={classes.regular}>
            {teacherInstructionsEnabled && (
              <InputContainer label={teacherInstructions.label} className={classes.prompt}>
                <EditableHtml
                  markup={model.teacherInstructions || ''}
                  onChange={onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
                  pieApi={pieApi}
                />
              </InputContainer>
            )}
            {promptEnabled && (
              <InputContainer label={prompt.label} className={classes.prompt}>
                <EditableHtml
                  markup={model.prompt || ''}
                  onChange={onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={defaultImageMaxWidth}
                  maxImageHeight={defaultImageMaxHeight}
                  pieApi={pieApi}
                />
              </InputContainer>
            )}

            {rationaleEnabled && (
              <InputContainer
                label={rationale.label}
                className={classes.prompt}
              >
                <EditableHtml
                  markup={model.rationale || ''}
                  onChange={onRationaleChanged}
                  imageSupport={imageSupport}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.rationale || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.rationale || defaultImageMaxHeight}
                  pieApi={pieApi}
                />
              </InputContainer>
            )}

            <div className={classNames(classes.label, classes.flexContainer)}>
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
                <Info fontSize={'small'} color={'primary'} style={{ float: 'right' }}/>
              </Tooltip>
            </div>
            {shapesError && <div className={classes.errorText}>{shapesError}</div>}
            {selectionsError && <div className={classes.errorText}>{selectionsError}</div>}

            <HotspotPalette
              hotspotColor={model.hotspotColor}
              hotspotList={model.hotspotList}
              outlineColor={model.outlineColor}
              outlineList={model.outlineList}
              onHotspotColorChange={color =>
                this.handleColorChange('hotspot', color)
              }
              onOutlineColorChange={color =>
                this.handleColorChange('outline', color)
              }
            />

            <HotspotContainer
              dimensions={model.dimensions}
              imageUrl={model.imageUrl}
              multipleCorrect={model.multipleCorrect}
              hotspotColor={model.hotspotColor}
              outlineColor={model.outlineColor}
              onUpdateImageDimension={onUpdateImageDimension}
              onUpdateShapes={onUpdateShapes}
              onImageUpload={onImageUpload}
              shapes={model.shapes}
              strokeWidth={model.strokeWidth}
              preserveAspectRatioEnabled={preserveAspectRatio.enabled}
            />

            {model.imageUrl && (
              <div>
                <Typography className={classes.label} variant="subheading">
                  Image Dimensions
                </Typography>

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
              </div>
            )}
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 3
  },
  container: {
    display: 'flex',
    marginTop: theme.spacing.unit
  },
  dimensions: {
    display: 'flex'
  },
  field: {
    flex: 1,
    width: '90%'
  },
  label: {
    marginTop: theme.spacing.unit * 4
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  subheading: {
    marginRight: '5px'
  },
  regular: {
    marginBottom: theme.spacing.unit * 3
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    padding: '5px 0'
  }
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  configuration: PropTypes.object,
  model: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func
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
