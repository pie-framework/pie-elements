import React from 'react';
import PropTypes from 'prop-types';

import { settings, layout } from '@pie-lib/config-ui';

import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';

import { ConfimationDialog, PassageButton } from './common';
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
    this.state = { showConfirmationDialog: false, indexToRemove: -1 };
  }

  getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

  onDelete = (model, indexToRemove, onModelChanged) => {
    let updatedPassages = model.passages;
    updatedPassages.splice(indexToRemove, 1);
    onModelChanged({ ...model, passages: updatedPassages });

    this.setState({
      showConfirmationDialog: false,
      indexToRemove: -1,
    });
  };

  removeAdditionalPassage = (indexToRemove) => {
    const { model = {}, onModelChanged } = this.props;
    const { passages = [] } = model;

    const { teacherInstructions = '', title = '', subtitle = '', author = '', text = '' } = passages[indexToRemove];

    if (
      this.getInnerText(teacherInstructions).trim() ||
      this.getInnerText(title).trim() ||
      this.getInnerText(subtitle).trim() ||
      this.getInnerText(author).trim() ||
      this.getInnerText(text).trim()
    ) {
      this.setState({
        showConfirmationDialog: true,
        indexToRemove,
      });
    } else {
      this.onDelete(model, indexToRemove, onModelChanged);
    }
  };

  addAdditionalPassage = () => {
    const { model, onModelChanged } = this.props;

    const updatedPassages = [
      ...model.passages,
      {
        teacherInstructions: '',
        title: '',
        subtitle: '',
        author: '',
        text: '',
      },
    ];
    onModelChanged({ ...model, passages: updatedPassages });
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

    const confirmationDialogContent = `${additionalPassage.label} will be deleted`;

    const { indexToRemove, showConfirmationDialog } = this.state;

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
        {passages.map((passage, passageIndex) => (
          <React.Fragment key={passageIndex}>
            {passageIndex > 0 && (
              <Typography variant="h5" className={classes.additionalPassageHeading}>
                {additionalPassage.label}
              </Typography>
            )}
            <Passage
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              model={model}
              configuration={configuration}
              passageIndex={passageIndex}
              onModelChanged={onModelChanged}
            />
            {passageIndex > 0 && additionalPassage.enabled && (
              <PassageButton
                type={'remove'}
                label={`Remove ${additionalPassage.label}`}
                onClick={() => this.removeAdditionalPassage(passageIndex)}
              />
            )}
            {passageIndex === 0 && additionalPassage.enabled && passages.length < 2 && (
              <PassageButton label={`Add ${additionalPassage.label}`} onClick={this.addAdditionalPassage} />
            )}
          </React.Fragment>
        ))}
        <ConfimationDialog
          open={showConfirmationDialog}
          title={'Warning'}
          content={confirmationDialogContent}
          cancel={'Cancel'}
          ok={'Ok'}
          onCancel={() =>
            this.setState({
              showConfirmationDialog: false,
            })
          }
          onOk={() => this.onDelete(model, indexToRemove, onModelChanged)}
        />
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
