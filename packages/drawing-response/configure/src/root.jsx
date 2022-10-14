import React from 'react';
import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ImageContainer from './image-container';
import cloneDeep from 'lodash/cloneDeep';

const { Panel, toggle } = settings;

export class Root extends React.Component {
  onPromptChanged = (prompt) => {
    const { model, onModelChanged } = this.props;
    const update = cloneDeep(model);

    onModelChanged({
      ...update,
      prompt,
    });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      teacherInstructions,
    });
  };

  onUpdateImageDimension = (dimensions) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      imageDimensions: dimensions,
    });
  };

  onImageUpload = (imageUrl) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      imageUrl,
    });
  };

  componentDidMount() {
    const { model, onModelChanged, configuration } = this.props || {};
    const { withRubric } = configuration || {};

    if (withRubric.enabled) {
      onModelChanged({
        ...model,
        rubricEnabled: true,
      });
    }
  }

  render() {
    const {
      classes,
      configuration,
      model,
      imageSupport,
      uploadSoundSupport,
      onConfigurationChanged,
      onModelChanged,
    } = this.props;
    const {
      backgroundImage = {},
      prompt = {},
      teacherInstructions = {},
      spellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric,
    } = configuration || {};
    const {
      teacherInstructionsEnabled,
      promptEnabled,
      spellCheckEnabled,
      backgroundImageEnabled,
      rubricEnabled
    } = model || {};
    const toolbarOpts = {};

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
              onChangeModel={onModelChanged}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  backgroundImageEnabled: backgroundImage.settings && toggle(backgroundImage.label),
                  promptEnabled: prompt.settings && toggle(prompt.label)
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  spellCheckEnabled:
                    spellCheck.settings && toggle(spellCheck.label),
                  rubricEnabled: withRubric.settings && toggle(withRubric.label)
                },
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
                  onChange={this.onTeacherInstructionsChanged}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
              </InputContainer>
            )}

            {promptEnabled && (
              <InputContainer label="Item Stem" className={classes.prompt}>
                <EditableHtml
                  markup={model.prompt}
                  onChange={this.onPromptChanged}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  imageSupport={imageSupport}
                  maxImageWidth={defaultImageMaxWidth}
                  maxImageHeight={defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
              </InputContainer>
            )}

            {backgroundImageEnabled && (
              <div>
                <Typography className={classes.label} variant="subheading">
                  Define Background Image
                </Typography>

                <ImageContainer
                  imageUrl={model.imageUrl}
                  onUpdateImageDimension={this.onUpdateImageDimension}
                  onImageUpload={this.onImageUpload}
                  imageDimensions={model.imageDimensions}
                />
              </div>
            )}
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

const styles = (theme) => ({
  base: {
    marginTop: theme.spacing.unit * 3,
  },
  label: {
    marginTop: theme.spacing.unit * 4,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
  regular: {
    marginBottom: theme.spacing.unit * 3,
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
  onModelChanged: PropTypes.func.isRequired,
  onConfigurationChanged: PropTypes.func.isRequired,
};

export default withStyles(styles)(Root);
