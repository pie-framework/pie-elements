import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';
import { Tokenizer } from '@pie-lib/text-select';
import {
  InputCheckbox,
  InputContainer,
  NumberTextField,
  FeedbackConfig
} from '@pie-lib/config-ui';
import Chip from '@material-ui/core/Chip';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';

const log = debug('@pie-element:select-text:configure');

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    onPromptChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {};

  changeText = event => {
    this.apply(u => {
      u.text = event.target.value;
      u.tokens = [];
    });
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

  changeHighlight = () => {
    this.apply(u => (u.highlightChoices = !u.highlightChoices));
  };

  apply = fn => {
    const { onChange, model } = this.props;
    const update = cloneDeep(model);
    fn(update);
    onChange(update);
  };

  changeFeedback = feedback => {
    this.apply(u => (u.feedback = feedback));
  };

  render() {
    const { model, classes, className, onPromptChanged, imageSupport } = this.props;
    const { configure : {
      promptLabel,
      enableContentChange,
      contentLabel,
      enableHighlightChoices,
      highlightChoicesLabel,
      enableTokensChange,
      tokensLabel,
      showMode,
      modeLabel,
      showSelections,
      availableSelectionsLabel,
      showCorrectAnswersNumber,
      correctAnswersLabel,
      showSelectionCount,
      selectionCountLabel,
      enableFeedback
    }} = model;

    log('[render] maxSelections:', model.maxSelections);

    return (
      <div className={className}>
        <InputContainer label={promptLabel} className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.prompt}
            onChange={onPromptChanged}
            imageSupport={imageSupport}
          />
        </InputContainer>

        {
          enableContentChange &&
          <TextField
            label={contentLabel}
            className={classes.input}
            multiline
            value={model.text}
            onChange={this.changeText}
          />
        }

        {
          enableHighlightChoices &&
          <InputCheckbox
            label={highlightChoicesLabel}
            checked={model.highlightChoices}
            onChange={this.changeHighlight}
          />
        }

        {
          enableTokensChange &&
          <InputContainer label={tokensLabel} className={classes.tokenizerContainer}>
            <Tokenizer
              className={classes.tokenizer}
              text={model.text}
              tokens={model.tokens}
              onChange={this.changeTokens}
            />
          </InputContainer>
        }

        {
          showMode &&
          <Chip
            label={`${modeLabel}: ${model.mode ? model.mode : 'None'}`}
            className={classes.chip}
          />
        }

        {
          showSelections &&
          <Chip
            label={`${availableSelectionsLabel}: ${model.tokens.length}`}
            className={classes.chip}
          />
        }

        {
          showCorrectAnswersNumber &&
          <Chip
            label={`${correctAnswersLabel}: ${
              model.tokens.filter(t => t.correct).length
              }`}
            className={classes.chip}
          />
        }

        {
          showSelectionCount &&
          <NumberTextField
            min={0}
            label={`${selectionCountLabel} (0:any)`}
            max={model.tokens.length}
            value={model.maxSelections}
            onChange={this.changeMaxSelections}
            className={classes.numberField}
          />
        }

        {
          enableFeedback &&
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.changeFeedback}
          />
        }

      </div>
    );
  }
}
export default withStyles(theme => ({
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
