import React from 'react';
import PropTypes from 'prop-types';

import { settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import Translator from '@pie-lib/pie-toolbox/translator';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Passage from './passage';
import PassageButton from './passageButton';

const { Panel, toggle, dropdown } = settings;
const { translator } = Translator;

export const ConfimationDialog = ({ content, cancel, title, ok, open, onOk, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      <DialogContentText>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          {ok}
        </Button>
      )}
      {onCancel && (
        <Button onClick={onCancel} color="primary">
          {cancel}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export const IconButton = ({ label, onClick }) => {};

ConfimationDialog.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  cancel: PropTypes.string,
  ok: PropTypes.string,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

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
    this.state = { showConfirmationDialog: false };
  }

  getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

  onDelete = (model, indexToRemove, onModelChanged) => {
    let updatedPassages = model.passages;
    updatedPassages.splice(indexToRemove, 1);
    onModelChanged({ ...model, passages: updatedPassages });

    this.setState({
      showConfirmationDialog: false,
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

    const confirmationDialogContent = translator.t('translation:passage:confirmToDeleteText', {
      lng: model.language,
    });

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
        {passages.map((passage, passageIndex) => {
          return (
            <React.Fragment>
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
              {passageIndex > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => this.removeAdditionalPassage(passageIndex)}
                >
                  {`Remove ${additionalPassage.label}`}
                </Button>
              )}
              {passageIndex === 0 && additionalPassage.enabled && passages.length < 2 && (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={this.addAdditionalPassage}
                >
                  {`Add ${additionalPassage.label}`}
                </Button>
              )}
              <ConfimationDialog
                open={this.state.showConfirmationDialog}
                title={translator.t('common:warning', {
                  lng: model.language,
                })}
                content={confirmationDialogContent}
                cancel={translator.t('common:cancel', {
                  lng: model.language,
                })}
                ok={translator.t('common:ok', {
                  lng: model.language,
                })}
                onCancel={() =>
                  this.setState({
                    showConfirmationDialog: false,
                  })
                }
                onOk={() => this.onDelete(model, passageIndex, onModelChanged)}
              />
            </React.Fragment>
          );
        })}
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
