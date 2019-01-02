import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Response from './response';
import { MathToolbar } from '@pie-lib/math-toolbar';
import AnswerBlock from './answer-block';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  templateTitle: {
    fontSize: '0.85rem'
  },
  selectContainer: {
    width: '40%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  inputContainer: {
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    width: '90%'
  },
  responseEditor: {
    display: 'flex',
    justifyContent: 'center',
    width: 'auto',
    minWidth: '500px',
    maxWidth: '900px',
    height: 'auto',
    minHeight: '130px',
    textAlign: 'left',
    padding: theme.spacing.unit
  },
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showKeypad: false,
      advancedAnswerIsPristine: true
    };
  }

  onChange = name => evtOrValue => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    if (typeof evtOrValue === 'object') {
      newModel[name] = evtOrValue.target.value;
    } else {
      newModel[name] = evtOrValue;
    }

    onChange(newModel);
  };

  onDone = () => {
    this.setState({ showKeypad: false });
  };

  onFocus = () => {
    this.setState({ showKeypad: true });
  };

  onAnswerBlockAdd = answerBlockId => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    // first answer block is in the model by default, UX requirement
    if (answerBlockId !== 'answerBlock1') {
      const response = {
        id: answerBlockId,
        validation: 'symbolic',
        answer: '',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      };

      newModel.responses = newModel.responses.concat(response);
      onChange(newModel);
    }

    this.handleAnswerBlockDomUpdate(answerBlockId, newModel.responses.length - 1, '');
  };

  handleAnswerBlockDomUpdate = (answerBlockId, index, latex) => {
    const container = document.getElementById(answerBlockId);
    const element = (
      <AnswerBlock
        id={answerBlockId}
        index={index}
        latex={answerBlockId === 'answerBlock1' ? 'y = mx + b' : latex}
      />
    );

    if (container) {
      ReactDOM.render(element, document.getElementById(answerBlockId));
    } else {
      setTimeout(() => this.handleAnswerBlockDomUpdate(answerBlockId, index, latex), 200);
    }
  };

  onResponseChange = (response, index) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.responses[index] = response;
    onChange(newModel);

    if (model.mode === 'advanced') {
      // the changed answer is not the default one, so we're no longer working with a pristine answer
      this.setState({
        advancedAnswerIsPristine: false
      });
    }

    this.handleAnswerBlockDomUpdate(response.id, index, response.answer)
  };

  onDefaultResponseChange = response => {
    const { model, onChange } = this.props;
    const { advancedAnswerIsPristine } = this.state;
    const newModel = { ...model };

    newModel.defaultResponse = response;

    if (advancedAnswerIsPristine) {
      newModel.responses[0] = { ...response };
    }

    onChange(newModel);
  };

  render() {
    const { classes, model } = this.props;
    const { showKeypad } = this.state;
    const { mode, question, expression, equationEditor, responses, defaultResponse } = model;

    const classNames = {
      editor: classes.responseEditor,
      mathToolbar: classes.mathToolbar
    };

    return (
      <div className={classes.container}>
        <InputContainer label="Item Type" className={classes.selectContainer}>
          <Select
            className={classes.select}
            onChange={this.onChange('mode')}
            value={mode}
          >
            <MenuItem value="simple">Simple</MenuItem>
            <MenuItem value="advanced">Advanced Multi</MenuItem>
          </Select>
        </InputContainer>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            label="ITEM STEM"
            type="textarea"
            value={question}
            onChange={this.onChange('question')}
          />
        </div>
        {mode === 'advanced' && <div className={classes.inputContainer}>
          <InputLabel className={classes.templateTitle}>RESPONSE TEMPLATE</InputLabel>
          <MathToolbar
            classNames={classNames}
            allowAnswerBlock
            onAnswerBlockAdd={this.onAnswerBlockAdd}
            controlledKeypad
            showKeypad={showKeypad}
            latex={expression}
            keypadMode="scientific"
            onChange={this.onChange('expression')}
            onFocus={this.onFocus}
            onDone={this.onDone}
          />
        </div>}
        <h3>Define Correct Response</h3>
        <InputContainer label="Equation Editor" className={classes.selectContainer}>
          <Select
            className={classes.select}
            onChange={this.onChange('equationEditor')}
            value={equationEditor}
          >
            <MenuItem value="simple">Lower Grade</MenuItem>
            <MenuItem value="advanced">Higher Grade</MenuItem>
            <MenuItem value="scientific">Scientific</MenuItem>
          </Select>
        </InputContainer>
        {mode === 'simple' && (
          <Response
            mode={equationEditor}
            defaultResponse
            response={defaultResponse}
            onResponseChange={this.onDefaultResponseChange}
          />
        )}
        {mode === 'advanced' && responses.map((response, idx) => (
          <Response
            key={response.id}
            mode={equationEditor}
            response={response}
            onResponseChange={this.onResponseChange}
            index={idx}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
