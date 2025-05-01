import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Passage} from './passage';

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
      baseInputConfiguration = {},
      teacherInstructions = {},
      title = {},
      subtitle = {},
      text = {},
      author = {},
      additionalPassage = {}
    } = configuration || {};
    const {
      extraCSSRules,
    } = model || {};


    const panelSettings = {
      titleEnabled: title && title.settings && toggle(title.label),
      subtitleEnabled: subtitle && subtitle.settings && toggle(subtitle.label),
      authorEnabled: author && author.settings && toggle(author.label),
      textEnabled: text && text.settings && toggle(text.label),
      'additionalPassage.enabled': additionalPassage && additionalPassage.settings && toggle(additionalPassage.label, true)
    };

    const panelProperties = {
      teacherInstructionsEnabled:
        teacherInstructions && teacherInstructions.settings && toggle(teacherInstructions.label),
      'language.enabled': language && language.settings && toggle(language.label, true),
      language:
        language && language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
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
       <Passage imageSupport={imageSupport} uploadSoundSupport={uploadSoundSupport} model={model} configuration={configuration} onModelChanged={() => onModelChanged}  classes={classes}/>
        <Button size="small" variant="outlined" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={() => console.log('Andreea')}>
          Additional Passage
        </Button>
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
