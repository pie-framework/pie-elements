import React from 'react';
import {
  settings,
  layout,
  InputContainer,
  NumberTextField
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import HotspotPalette from './hotspot-palette';
import HotspotContainer from './hotspot-container';

const { Panel, toggle } = settings;

class Root extends React.Component {
  handleColorChange(type, color) {
    const { onColorChanged } = this.props;
    const cType = `${type}Color`;
    onColorChanged(cType, color);
  }

  handleOnUpdateImageDimensions = (value, type) => {
    const { model: { dimensions }, onUpdateImageDimension } = this.props;
    const newDimensions = {
      ...dimensions,
      [type]: value
    };
    onUpdateImageDimension(newDimensions);
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
      onUpdateShapes,
      onTeacherInstructionsChanged
    } = this.props;
    const { multipleCorrect, partialScoring, teacherInstructions = {} } = configuration;
    const { rationale = {} } = configuration;

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
                  'rationale.enabled':
                    rationale.settings && toggle(rationale.label, true)
                },
                Properties: {
                  'teacherInstructions.enabled':
                    teacherInstructions.settings && toggle(teacherInstructions.label, true)
                }
              }}
            />
          }
        >
          <div className={classes.regular}>
            {teacherInstructions.enabled && (
              <InputContainer label={teacherInstructions.label} className={classes.prompt}>
                <EditableHtml
                  markup={model.teacherInstructions || ''}
                  onChange={onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}

            <InputContainer label="Item Stem" className={classes.prompt}>
              <EditableHtml markup={model.prompt} onChange={onPromptChanged} />
            </InputContainer>

            {rationale.enabled && (
              <InputContainer
                label={rationale.label}
                className={classes.prompt}
              >
                <EditableHtml
                  markup={model.rationale || ''}
                  onChange={onRationaleChanged}
                  imageSupport={imageSupport}
                />
              </InputContainer>
            )}

            <Typography className={classes.label} variant="subheading">
              Define Hotspot
            </Typography>

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
              shapes={model.shapes.rectangles}
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
  regular: {
    marginBottom: theme.spacing.unit * 3
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  }
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  configuration: PropTypes.object,
  disableSidePanel: PropTypes.bool,
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
