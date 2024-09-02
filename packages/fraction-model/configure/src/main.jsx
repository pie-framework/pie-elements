import React from 'react';
import { FormSection, layout } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CardBar from './card-bar';
import ModelOptions from './model-options';

const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
  question: {
    marginBottom: theme.spacing.unit * 4,
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
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
});

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      dialog: {
        open: false,
        text: '',
      },
      correctAnswerDialog: {
        open: false,
        text: '',
      },
    };
  }

  render() {
    const { classes, model, onChange, configuration, uploadSoundSupport } = this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      title = {},
      question = {},
      modelOptions = {},
      mathMlOptions = {},
    } = configuration || {};

    const {
      errors = {},
      spellCheckEnabled,
      toolbarEditorPosition,
    } = model || {};

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={true}
      >
        <CardBar
          header="Set Up"
        >
        </CardBar>

        <FormSection label={title?.label || 'Title'} className={classes.title}>
          <EditableHtml
            className={classes.title}
            markup={model.title || ''}
            onChange={(title) => onChange({ title })}
            toolbarOpts={toolbarOpts}
            activePlugins={[
              'bold',
              'html',
              'italic',
              'underline',
              'strikethrough',
              'image',
              'math',
              'languageCharacters',
              'responseArea',
            ]}
            pluginProps={getPluginProps(title?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </FormSection>

        <FormSection label={question?.label || 'Question'} className={classes.question}>
          <EditableHtml
            markup={model.question || ''}
            minHeight={60}
            onChange={(question) => onChange({ question })}
            toolbarOpts={toolbarOpts}
            pluginProps={getPluginProps(question?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </FormSection>

        <FormSection>
          <ModelOptions
            model={model}
            onChange={onChange}
            modelOptions={modelOptions}
          />
        </FormSection>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles, { name: 'Main' })(Main);
