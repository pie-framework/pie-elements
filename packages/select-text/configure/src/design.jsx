import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { Tokenizer } from '@pie-lib/text-select';
import {
  InputContainer,
  NumberTextField,
  FeedbackConfig,
  settings,
  layout
} from '@pie-lib/config-ui';
import Chip from '@material-ui/core/Chip';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle, radio } = settings;

const log = debug('@pie-element:select-text:configure');

const prepareText = text => (text || '').replace(/( +.{1})\./g, '$1 .');

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    const { model } = this.props;

    this.state = {
      text: model ? prepareText(model.text) : ''
    };
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const { model } = nProps;

    if (model && model.text) {
      this.setState({
        text: model.text
      });
    }
  }

  updateText = debounce(val => {
    this.apply(u => {
      u.text = val;
      u.tokens = [];
    });
  }, 200);

  changeText = event => {
    const value = event.target.value;
    const preparedText = prepareText(value);

    this.setState({
      text: value
    });
    this.updateText(preparedText);
  };

  changeTokens = (tokens, mode) => {
    this.apply(u => {
      u.tokens = tokens;
      u.mode = mode;

      const correctTokenCount = tokens.filter(t => t.correct).length;
      const max = isFinite(u.maxSelections) ? u.maxSelections : 0;

      u.maxSelections = Math.max(max, correctTokenCount);
    });
  };

  changeMaxSelections = (event, max) => {
    this.apply(u => (u.maxSelections = max));
  };

  apply = fn => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);
    fn(update);
    onModelChanged(update);
  };

  changeFeedback = feedback => {
    this.apply(u => (u.feedback = feedback));
  };

  changePartialScoring = partialScoring => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);
    update.partialScoring = partialScoring;
    onModelChanged(update);
  };

  onPromptChanged = prompt => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.prompt = prompt;
    onModelChanged(update);
  };

  onTeacherInstructionsChanged = teacherInstructions => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.teacherInstructions = teacherInstructions;
    onModelChanged(update);
  };

  onRationaleChanged = rationale => {
    const { onModelChanged, model } = this.props;

    onModelChanged({
      ...model,
      rationale
    });
  };

  render() {
    const { text: textValue } = this.state;
    const {
      model,
      classes,
      imageSupport,
      onModelChanged,
      configuration,
      onConfigurationChanged
    } = this.props;
    const {
      prompt = {},
      text = {},
      tokens = {},
      mode = {},
      feedback = {},
      partialScoring = {},
      selections = {},
      selectionCount = {},
      correctAnswer = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      scoringType = {},
      highlightChoices = {}
    } = configuration || {};
    const {
      teacherInstructionsEnabled, promptEnabled, rationaleEnabled, feedbackEnabled
    } = model || {};

    log('[render] maxSelections:', model.maxSelections);

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={model => onModelChanged(model)}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: {
                partialScoring:
                  partialScoring.settings && toggle(partialScoring.label),
                highlightChoices:
                  highlightChoices.settings && toggle(highlightChoices.label),
                feedbackEnabled:
                  feedback.settings && toggle(feedback.label)
              },
              Properties: {
                teacherInstructionsEnabled:
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label),
                studentInstructionsEnabled:
                  studentInstructions.settings &&
                  toggle(studentInstructions.label),
                promptEnabled: prompt.settings && toggle(prompt.label),
                rationaleEnabled: rationale.settings && toggle(rationale.label),
                scoringType:
                  scoringType.settings &&
                  radio(scoringType.label, ['auto', 'rubric'])
              }
            }}
          />
        }
      >
        <div className={classes.container}>
          {teacherInstructionsEnabled && (
            <InputContainer
              label={teacherInstructions.label}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.onTeacherInstructionsChanged}
                imageSupport={imageSupport}
                nonEmpty={false}
              />
            </InputContainer>
          )}

          {promptEnabled && (
            <InputContainer
              label={prompt.label || ''}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={this.onPromptChanged}
                imageSupport={imageSupport}
              />
            </InputContainer>
          )}

          {rationaleEnabled && (
            <InputContainer
              label={rationale.label || ''}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.rationale || ''}
                onChange={this.onRationaleChanged}
                imageSupport={imageSupport}
              />
            </InputContainer>
          )}

          {text.settings && (
            <TextField
              label={text.label}
              className={classes.input}
              multiline
              value={textValue}
              onChange={this.changeText}
            />
          )}

          {tokens.settings && (
            <InputContainer
              label={tokens.label || ''}
              className={classes.tokenizerContainer}
            >
              <Tokenizer
                className={classes.tokenizer}
                text={model.text}
                tokens={model.tokens}
                onChange={this.changeTokens}
              />
            </InputContainer>
          )}

          {mode.settings && (
            <Chip
              label={`${mode.label}: ${model.mode ? model.mode : 'None'}`}
              className={classes.chip}
            />
          )}

          {selections.settings && (
            <Chip
              label={`${selections.label}: ${model.tokens.length}`}
              className={classes.chip}
            />
          )}

          {correctAnswer.settings && (
            <Chip
              label={`${correctAnswer.label}: ${
                model.tokens.filter(t => t.correct).length
              }`}
              className={classes.chip}
            />
          )}

          {selectionCount.settings && (
            <NumberTextField
              min={0}
              label={`${selectionCount.label} (0:any)`}
              max={model.tokens.length}
              value={model.maxSelections}
              onChange={this.changeMaxSelections}
              className={classes.numberField}
            />
          )}

          {feedbackEnabled && (
            <FeedbackConfig
              feedback={model.feedback}
              onChange={this.changeFeedback}
            />
          )}
        </div>
      </layout.ConfigLayout>
    );
  }
}
export default withStyles(theme => ({
  container: {
    paddingTop: theme.spacing.unit
  },
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
      backgroundColor: theme.palette.primary.main
    },
    marginBottom: theme.spacing.unit
  },
  chip: {
    marginRight: theme.spacing.unit * 2
  },
  input: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 3
  },
  tokenizer: {
    marginTop: theme.spacing.unit * 2
  },
  mainOpts: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'baseline'
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  numberField: {
    width: '180px'
  }
}))(Design);
