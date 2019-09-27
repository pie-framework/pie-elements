import React from 'react';
import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ImageContainer from './image-container';

const { Panel, toggle } = settings;

class Root extends React.Component {
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
      onTeacherInstructionsChanged
    } = this.props;
    const { backgroundImage = {}, rationale = {}, prompt = {}, teacherInstructions = {} } =
      configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled } =
      model || {};

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
                Settings: {
                  'backgroundImage.enabled':
                    backgroundImage.settings &&
                    toggle(backgroundImage.label, true),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  promptEnabled: prompt.settings && toggle(prompt.label)
                },
                Properties: {}
              }}
            />
          }
        >
          <div className={classes.regular}>
            {teacherInstructionsEnabled && (
              <InputContainer
                label={teacherInstructions.label}
                className={classes.prompt}
              >
                <EditableHtml
                  markup={model.teacherInstructions || ''}
                  onChange={onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}

            {promptEnabled && (
              <InputContainer label="Item Stem" className={classes.prompt}>
                <EditableHtml
                  markup={model.prompt}
                  onChange={onPromptChanged}
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
                />
              </InputContainer>
            )}

            {backgroundImage.enabled && (
              <div>
                <Typography className={classes.label} variant="subheading">
                  Define Background Image
                </Typography>

                <ImageContainer
                  imageDimensions={model.imageDimensions}
                  imageUrl={model.imageUrl}
                  multipleCorrect={model.multipleCorrect}
                  hotspotColor={model.hotspotColor}
                  outlineColor={model.outlineColor}
                  onUpdateImageDimension={onUpdateImageDimension}
                  onImageUpload={onImageUpload}
                  shapes={model.shapes}
                />
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
  label: {
    marginTop: theme.spacing.unit * 4
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  regular: {
    marginBottom: theme.spacing.unit * 3
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
  onPromptChanged: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onModelChangedByConfig: PropTypes.func.isRequired,
  onRationaleChanged: PropTypes.func.isRequired,
  onConfigurationChanged: PropTypes.func.isRequired,
  onTeacherInstructionsChanged: PropTypes.func.isRequired
};

export default withStyles(styles)(Root);
