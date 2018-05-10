import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import cloneDeep from 'lodash/cloneDeep';
import { Tokenizer } from '@pie-lib/text-select';
import {
  InputCheckbox,
  InputContainer,
  NumberTextField,
  FeedbackConfig
} from '@pie-lib/config-ui';
import Chip from 'material-ui/Chip';
import debug from 'debug';

const log = debug('@pie-element:select-text:configure');

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {};

  changeText = event => {
    this.apply(u => {
      u.text = event.target.value;
      u.tokens = [];
    });
  };

  changeTokens = tokens => {
    this.apply(u => {
      u.tokens = tokens;
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
    const { model, classes, className } = this.props;

    log('[render] maxSelections:', model.maxSelections);

    return (
      <div className={className}>
        <TextField
          label="Content"
          className={classes.input}
          multiline
          value={model.text}
          onChange={this.changeText}
        />

        <InputCheckbox
          label={'Highlight choices'}
          checked={model.highlightChoices}
          onChange={this.changeHighlight}
        />

        <InputContainer label={'Tokens'} className={classes.tokenizerContainer}>
          <Tokenizer
            className={classes.tokenizer}
            text={model.text}
            tokens={model.tokens}
            onChange={this.changeTokens}
          />
        </InputContainer>
        <Chip
          label={`Selections Available: ${model.tokens.length}`}
          className={classes.chip}
        />
        <Chip
          label={`Correct Answers: ${
            model.tokens.filter(t => t.correct).length
          }`}
          className={classes.chip}
        />
        <NumberTextField
          min={0}
          label={'Selection count (0:any)'}
          max={model.tokens.length}
          value={model.maxSelections}
          onChange={this.changeMaxSelections}
        />

        <FeedbackConfig
          feedback={model.feedback}
          onChange={this.changeFeedback}
        />
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
  }
}))(Design);
