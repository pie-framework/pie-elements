import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputContainer, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml, ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';

const { Panel, toggle, dropdown } = settings;

export class Main extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { setDimensions: true };
  }

  handleChange = (fieldName, value, index = 0) => {
    const { model, onModelChanged } = this.props;

    if (!model || !onModelChanged || !model.passages || index < 0 || index >= model.passages.length) {
      return;
    }

    const updatedPassages = [...model.passages];
    updatedPassages[index] = { ...updatedPassages[index], [fieldName]: value };

    onModelChanged({ ...model, passages: updatedPassages });
  };

  render() {
    const { model, classes, configuration, imageSupport, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      settingsPanelDisabled,
      language = {},
      languageChoices = {},
      maxImageWidth = {},
      maxImageHeight = {},
      mathMlOptions = {},
      baseInputConfiguration = {},
      teacherInstructions = {},
      title = {},
      subtitle = {},
      text = {},
      author = {},
    } = configuration || {};
    const {
      errors = {},
      extraCSSRules,
      passages = [],
      teacherInstructionsEnabled,
      titleEnabled,
      subtitleEnabled,
      authorEnabled,
      textEnabled,
    } = model || {};

    const { passages: passagesErrors } = errors || {};
    const {
      teacherInstructions: teacherInstructionsError,
      title: titleError,
      subtitle: subtitleError,
      author: authorError,
      text: textError,
    } = (passagesErrors && passagesErrors[0]) || {}; // only the first passage errors are needed for now

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelSettings = {
      titleEnabled: title && title.settings && toggle(title.label),
      subtitleEnabled: subtitle && subtitle.settings && toggle(subtitle.label),
      authorEnabled: author && author.settings && toggle(author.label),
      textEnabled: text && text.settings && toggle(text.label),
    };

    const panelProperties = {
      teacherInstructionsEnabled:
        teacherInstructions && teacherInstructions.settings && toggle(teacherInstructions.label),
      'language.enabled': language && language.settings && toggle(language.label, true),
      language:
        language && language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const getPluginProps = (customConfiguration) => {
      return {
        ...baseInputConfiguration,
        ...customConfiguration,
      };
    };

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={(config) => onConfigurationChanged(config)}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[0].teacherInstructions || ''}
              onChange={(value) => this.handleChange('teacherInstructions', value)}
              nonEmpty={false}
              error={teacherInstructionsError}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {titleEnabled && (
          <InputContainer label={title.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[0].title || ''}
              onChange={(value) => this.handleChange('title', value)}
              nonEmpty={false}
              error={titleError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(title?.inputConfiguration)}
            />
            {titleError && <div className={classes.errorText}>{titleError}</div>}
          </InputContainer>
        )}

        {subtitleEnabled && (
          <InputContainer label={subtitle.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[0].subtitle || ''}
              onChange={(value) => this.handleChange('subtitle', value)}
              nonEmpty={false}
              error={subtitleError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(subtitle?.inputConfiguration)}
            />
            {subtitleError && <div className={classes.errorText}>{subtitleError}</div>}
          </InputContainer>
        )}

        {authorEnabled && (
          <InputContainer label={author.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[0].author || ''}
              onChange={(value) => this.handleChange('author', value)}
              nonEmpty={false}
              error={authorError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(author?.inputConfiguration)}
            />
            {authorError && <div className={classes.errorText}>{authorError}</div>}
          </InputContainer>
        )}

        {textEnabled && (
          <InputContainer label={text.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[0].text || ''}
              onChange={(value) => this.handleChange('text', value)}
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              nonEmpty={false}
              error={textError}
              maxImageWidth={(maxImageWidth && maxImageWidth.text) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.text) || defaultImageMaxHeight}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(text?.inputConfiguration)}
            />
            {textError && <div className={classes.errorText}>{textError}</div>}
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}
export default withStyles((theme) => ({
  inputContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
}))(Main);
