import React from 'react';
import { FeedbackSelector, InputContainer, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { EditableHtml, ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';

const { Panel, toggle, numberFields, dropdown } = settings;

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

  changeTeacherInstructions = (teacherInstructions, index = 0) => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = model.passages.map((passage, i) => {
      if (i === index) {
        return { ...passage, teacherInstructions: teacherInstructions };
      }
      return passage;
    });

    const updatedModel = { ...model, passages: updatedPassages };

    onModelChanged(updatedModel);
  };

  changeTitle = (title, index = 0) => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = model.passages.map((passage, i) => {
      if (i === index) {
        return { ...passage, title: title };
      }
      return passage;
    });

    const updatedModel = { ...model, passages: updatedPassages };

    onModelChanged(updatedModel);
  };
  
  changeSubtitle = (subtitle, index = 0) => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = model.passages.map((passage, i) => {
      if (i === index) {
        return { ...passage, subtitle: subtitle };
      }
      return passage;
    });

    const updatedModel = { ...model, passages: updatedPassages };

    onModelChanged(updatedModel);
  };

  changeAuthor = (author, index = 0) => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = model.passages.map((passage, i) => {
      if (i === index) {
        return { ...passage, author: author };
      }
      return passage;
    });

    const updatedModel = { ...model, passages: updatedPassages };

    onModelChanged(updatedModel);
  };

  changeText = (text, index = 0) => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = model.passages.map((passage, i) => {
      if (i === index) {
        return { ...passage, text: text };
      }
      return passage;
    });

    const updatedModel = { ...model, passages: updatedPassages };

    onModelChanged(updatedModel);
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
      title,
      subtitle,
      text,
      author,
    } = configuration || {};
    const {
      errors = {},
      teacherInstructionsEnabled,
      titleEnabled,
      subtitleEnabled,
      authorEnabled,
      textEnabled,
      passages = [{
        title,
        subtitle,
        text,
        author,
        teacherInstructions,
      }]
    } = model || {};
    const { teacherInstructions: teacherInstructionsError, title: titleError, subtitle: subtitleError, author: authorError, text: textError } = errors;

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelSettings = {
      titleEnabled: title.settings && toggle(title.label),
      subtitleEnabled: subtitle.settings && toggle(subtitle.label),
      authorEnabled: author.settings && toggle(author.label),
      textEnabled: text.settings && toggle(text.label),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const getPluginProps = (props) => {
      return Object.assign(
          {
            ...baseInputConfiguration,
          },
          props || {},
      );
    };

    return (
        <layout.ConfigLayout
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
          {titleEnabled && (
              <InputContainer label={title.label} className={classes.inputContainer}>
                <EditableHtml
                    markup={model.passages[0].title || ''}
                    onChange={this.changeTitle}
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
                    markup={model.passages[0].subtitle || ''}
                    onChange={this.changeSubtitle}
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
                    markup={model.passages[0].author || ''}
                    onChange={this.changeAuthor}
                    nonEmpty={false}
                    error={authorError}
                    mathMlOptions={mathMlOptions}
                    languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                    pluginProps={getPluginProps(author?.inputConfiguration)}
                />
                {authorError && <div className={classes.errorText}>{authorError}</div>}
              </InputContainer>
          )}
          {teacherInstructionsEnabled && (
              <InputContainer label={teacherInstructions.label} className={classes.inputContainer}>
                <EditableHtml
                    markup={model.teacherInstructions || ''}
                    onChange={this.changeTeacherInstructions}
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
          {textEnabled && (
              <InputContainer label={text.label} className={classes.inputContainer}>
                <EditableHtml
                    activePlugins={ALL_PLUGINS}
                    markup={model.passages[0].text || '' }
                    onChange={this.changeText}
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
