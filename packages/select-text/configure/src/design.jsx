import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { Tokenizer } from '@pie-lib/text-select';
import { InputContainer, NumberTextField, FeedbackConfig, settings, layout } from '@pie-lib/config-ui';
import Chip from '@material-ui/core/Chip';
import Info from '@material-ui/icons/Info';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';
import Tooltip from '@material-ui/core/Tooltip';
import { generateValidationMessage } from './utils';

const { Panel, toggle, radio, dropdown } = settings;

const log = debug('@pie-element:select-text:configure');

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    const { model } = this.props;

    this.state = {
      text: (model && model.text) || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const { model } = nProps;

    if (model && model.text) {
      this.setState({
        text: model.text,
      });
    }
  }

  updateText = debounce((val) => {
    this.apply((u) => {
      u.text = val;
      u.tokens = [];
    });
  }, 200);

  changeText = (event) => this.updateText(event.target.value);

  changeTokens = (tokens, mode) => {
    this.apply((u) => {
      u.tokens = tokens;
      u.mode = mode;

      const correctTokenCount = tokens.filter((t) => t.correct).length;
      const max = isFinite(u.maxSelections) ? u.maxSelections : 0;

      u.maxSelections = Math.max(max, correctTokenCount);
    });
  };

  changeMaxSelections = (event, max) => {
    this.apply((u) => (u.maxSelections = max));
  };

  apply = (fn) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    fn(update);
    onModelChanged(update);
  };

  changeFeedback = (feedback) => {
    this.apply((u) => (u.feedback = feedback));
  };

  changePartialScoring = (partialScoring) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);
    update.partialScoring = partialScoring;

    onModelChanged(update);
  };

  onPromptChanged = (prompt) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.prompt = prompt;
    onModelChanged(update);
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.teacherInstructions = teacherInstructions;
    onModelChanged(update);
  };

  onRationaleChanged = (rationale) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, rationale });
  };

  render() {
    const { text: textValue } = this.state;
    const { classes, configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      correctAnswer = {},
      contentDimensions = {},
      feedback = {},
      highlightChoices = {},
      mode = {},
      partialScoring = {},
      prompt = {},
      rationale = {},
      selectionCount = {},
      selections = {},
      settingsPanelDisabled,
      scoringType = {},
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      text = {},
      tokens = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      errors,
      feedbackEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};

    const { tokensError, selectionsError } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    let { tokens: tokensModel } = model;
    tokensModel = tokensModel || [];

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    log('[render] maxSelections:', model.maxSelections);

    const panelSettings = {
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      highlightChoices: highlightChoices.settings && toggle(highlightChoices.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label || ''} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </InputContainer>
        )}

        {text.settings && (
          <InputContainer label={text.label || ''} className={classes.promptHolder}>
            <TextField
              className={classes.input}
              multiline
              defaultValue={textValue}
              onChange={this.changeText}
              spellCheck={spellCheckEnabled}
            />
          </InputContainer>
        )}

        {tokens.settings && (
          <InputContainer label={tokens.label || ''} className={classes.tokenizerContainer}>
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ position: 'absolute', left: '48px', top: '-3px' }} />
            </Tooltip>

            <Tokenizer
              className={classes.tokenizer}
              text={model.text}
              tokens={tokensModel}
              onChange={this.changeTokens}
            />
          </InputContainer>
        )}
        {tokensError && <div className={classes.errorText}>{tokensError}</div>}
        {selectionsError && <div className={classes.errorText}>{selectionsError}</div>}

        <div className={classes.tokensDetails}>
          {mode.settings && (
            <Chip label={`${mode.label}: ${model.mode ? model.mode : 'None'}`} className={classes.chip} />
          )}

          {selections.settings && (
            <Chip label={`${selections.label}: ${tokensModel.length}`} className={classes.chip} />
          )}

          {correctAnswer.settings && (
            <Chip
              label={`${correctAnswer.label}: ${tokensModel.filter((t) => t.correct).length}`}
              className={classes.chip}
            />
          )}

          {selectionCount.settings && (
            <NumberTextField
              min={tokensModel.filter((t) => t.correct).length || 0}
              label={`${selectionCount.label} (0:any)`}
              max={tokensModel.length}
              value={model.maxSelections}
              onChange={this.changeMaxSelections}
              className={classes.numberField}
            />
          )}
        </div>

        {rationaleEnabled && (
          <InputContainer label={rationale.label || ''} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChanged}
              imageSupport={imageSupport}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </InputContainer>
        )}

        {feedbackEnabled && (
          <FeedbackConfig feedback={model.feedback} onChange={this.changeFeedback} toolbarOpts={toolbarOpts} />
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles((theme) => ({
  tokenizerContainer: {
    paddingRight: 0,
    marginRight: 0,
    '&:after': {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      content: '""',
      backgroundColor: theme.palette.primary.main,
    },
    marginBottom: theme.spacing.unit,
  },
  chip: {
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit * 2,
  },
  input: {
    width: '100%',
  },
  tokenizer: {
    marginTop: theme.spacing.unit * 2,
  },
  mainOpts: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'baseline',
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  tokensDetails: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 2.5,
  },
  numberField: {
    width: '180px',
    margin: `${theme.spacing.unit / 2}px auto 0`,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
}))(Design);
