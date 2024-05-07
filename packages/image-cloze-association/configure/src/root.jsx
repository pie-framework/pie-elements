import React from 'react';
import PropTypes from 'prop-types';
import { settings, layout, InputContainer } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { withStyles } from '@material-ui/core/styles';

const { Panel, toggle, dropdown } = settings;

export class Root extends React.Component {
  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });
  };

  render() {
    const { classes, model, configuration, onModelChanged, onConfigurationChanged, imageSupport, uploadSoundSupport } =
      this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      maxImageWidth = {},
      maxImageHeight = {},
      settingsPanelDisabled,
      spellCheck = {},
      teacherInstructions = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const { errors = {}, spellCheckEnabled } = model || {};
    const { teacherInstructions: teacherInstructionsError } = errors;

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={(config) => onConfigurationChanged(config)}
            groups={{
              Properties: panelProperties,
            }}
          />
        }
      >
        {model && model.teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              spellCheck={spellCheckEnabled}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
              maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions}
              maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        <div>Image cloze association</div>
      </layout.ConfigLayout>
    );
  }
}

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
  model: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
  uploadSoundSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
};

export default withStyles(styles)(Root);
