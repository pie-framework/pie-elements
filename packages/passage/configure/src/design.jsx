import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import Passage from './passage';

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
    this.state = { showAdditionalPassage: false };
  }

  toggleAdditionalPassage = () => {
    const { model, onModelChanged } = this.props;
    const { configuration = {} } = this.props;
    const { additionalPassage = {} } = configuration;
    let updatedPassages;

    if (!model || !onModelChanged || !model.passages) {
      return;
    }
    if (additionalPassage.enabled && this.state.showAdditionalPassage) {
      updatedPassages = model.passages.length ? [model.passages[0]] : [];
    } else {
      updatedPassages = [
        ...model.passages,
        {
          teacherInstructions: '',
          title: '',
          subtitle: '',
          author: '',
          text: '',
        },
      ];
    }

    onModelChanged({ ...model, passages: updatedPassages });
    this.setState({
      showAdditionalPassage: !this.state.showAdditionalPassage,
    });
  };

  render() {
    const { classes, model, configuration, imageSupport, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      settingsPanelDisabled,
      language = {},
      languageChoices = {},
      teacherInstructions = {},
      title = {},
      subtitle = {},
      text = {},
      author = {},
      additionalPassage = {},
    } = configuration || {};
    const { extraCSSRules, passages } = model || {};

    const { showAdditionalPassage } = this.state;
    const isAdditionalPassageShown = additionalPassage.enabled && showAdditionalPassage;
    const additionalPassageButtonLabel = isAdditionalPassageShown
      ? `Remove ${additionalPassage.label}`
      : `Add ${additionalPassage.label}`;
    const morePassages = passages && passages.length > 1;

    const panelSettings = {
      titleEnabled: title && title.settings && toggle(title.label),
      subtitleEnabled: subtitle && subtitle.settings && toggle(subtitle.label),
      authorEnabled: author && author.settings && toggle(author.label),
      textEnabled: text && text.settings && toggle(text.label),
      'additionalPassage.enabled':
        additionalPassage && additionalPassage.settings && toggle(additionalPassage.label, true),
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
        <Passage
          imageSupport={imageSupport}
          uploadSoundSupport={uploadSoundSupport}
          model={model}
          configuration={configuration}
          passageIndex={0}
          onModelChanged={onModelChanged}
        />
        {(isAdditionalPassageShown || morePassages) && (
          <Typography variant="heading" className={classes.additionalPassageHeading}>
            {additionalPassage.label}
          </Typography>
        )}
        {(isAdditionalPassageShown || morePassages) && (
          <Passage
            imageSupport={imageSupport}
            uploadSoundSupport={uploadSoundSupport}
            model={model}
            configuration={configuration}
            passageIndex={1}
            onModelChanged={onModelChanged}
          />
        )}
        {additionalPassage.enabled && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={this.toggleAdditionalPassage}
          >
            {additionalPassageButtonLabel}
          </Button>
        )}
      </layout.ConfigLayout>
    );
  }
}
export default withStyles((theme) => ({
  additionalPassageHeading: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
}))(Main);
