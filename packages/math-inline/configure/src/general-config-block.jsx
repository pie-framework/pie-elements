import * as React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Response from './response';
import { MathToolbar } from '@pie-lib/math-toolbar';
import { ResponseTypes } from './utils';

let registered = false;

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
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: '600px'
  },
  blockContainer: {
    margin: theme.spacing.unit,
    display: 'inline-flex',
    border: '2px solid grey'
  },
  blockResponse: {
    flex: 2,
    color: 'grey',
    background: 'lightgrey',
    fontSize: '0.8rem',
    padding: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '2px solid grey'
  },
  blockMath: {
    color: '#bdbdbd',
    padding: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 8,
    '& > .mq-math-mode': {
      '& > .mq-hasCursor': {
        '& > .mq-cursor': {
          display: 'none'
        }
      }
    }
  }
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    imageSupport: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showKeypad: false
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

    setTimeout(this.checkAnswerBlocks, 0);
  };

  onDone = () => {
    this.setState({ showKeypad: false });

    setTimeout(this.checkAnswerBlocks, 0);
  };

  onFocus = () => {
    this.setState({ showKeypad: true });
  };

  onAnswerBlockAdd = answerBlockId => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

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

    setTimeout(this.handleAnswerBlockDomUpdate(), 0);
  };

  UNSAFE_componentWillMount() {
    const { classes } = this.props;

    if (typeof window !== 'undefined') {
      const MathQuill = require('@pie-framework/mathquill');
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', data => {
          return {
            htmlString: `<div class="${classes.blockContainer}">
                <div class="${classes.blockResponse}" id="${data}Index">R</div>
                <div class="${classes.blockMath}">
                  <span id="${data}"></span>
                </div>
              </div>`,
            text: () => 'text',
            latex: () => `\\embed{answerBlock}[${data}]`
          };
        });

        registered = true;
      }
    }
  }

  componentDidMount() {
    this.handleAnswerBlockDomUpdate();
  }

  componentDidUpdate() {
    this.handleAnswerBlockDomUpdate();
  }

  handleAnswerBlockDomUpdate = () => {
    const { model } = this.props;

    if (this.root && model.responses.length) {
      model.responses.forEach((response, idx) => {
        const el = this.root.querySelector(`#${response.id}`);
        const indexEl = this.root.querySelector(`#${response.id}Index`);

        if (el) {
          const MathQuill = require('@pie-framework/mathquill');
          let MQ = MathQuill.getInterface(2);
          el.textContent = response.answer;
          MQ.StaticMath(el);
          indexEl.textContent = `R${idx + 1}`;
        }
      });
    }
  };

  checkAnswerBlocks = () => {
    const { model, onChange } = this.props;
    const newModel = { ...model };
    newModel.responses = [];

    model.responses.forEach(response => {
      const container = document.getElementById(response.id);

      if (container) {
        newModel.responses = newModel.responses.concat(response);
      }
    });

    onChange(newModel);
  };

  onResponseChange = (response, index) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.responses[index] = response;
    onChange(newModel);

    this.handleAnswerBlockDomUpdate(response.id, index, response.answer);
  };

  onSimpleResponseChange = response => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.response = response;

    onChange(newModel);
  };

  render() {
    const { classes, model, imageSupport } = this.props;
    const { showKeypad } = this.state;
    const {
      question,
      expression,
      equationEditor,
      responses,
      response,
      responseType
    } = model;

    const classNames = {
      editor: classes.responseEditor,
      mathToolbar: classes.mathToolbar
    };

    return (
      <div
        ref={r => (this.root = r || this.root)}
        className={classes.container}
      >
        <InputContainer label="Item Stem" className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={question}
            onChange={this.onChange('question')}
            imageSupport={imageSupport}
            nonEmpty={false}
          />
        </InputContainer>
        {responseType === ResponseTypes.advanced && (
          <div className={classes.inputContainer}>
            <InputLabel className={classes.templateTitle}>
              RESPONSE TEMPLATE
            </InputLabel>
            <MathToolbar
              classNames={classNames}
              allowAnswerBlock
              onAnswerBlockAdd={this.onAnswerBlockAdd}
              controlledKeypad
              showKeypad={showKeypad}
              latex={expression}
              keypadMode="everything"
              onChange={this.onChange('expression')}
              onFocus={this.onFocus}
              onDone={this.onDone}
            />
          </div>
        )}
        <h3>Define Correct Response</h3>
        <InputContainer
          label="Equation Editor"
          className={classes.selectContainer}
        >
          <Select
            className={classes.select}
            onChange={this.onChange('equationEditor')}
            value={equationEditor}
          >
            <MenuItem value={1}>Grade 1 - 2</MenuItem>
            <MenuItem value={3}>Grade 3 - 5</MenuItem>
            <MenuItem value={6}>Grade 6 - 7</MenuItem>
            <MenuItem value={8}>Grade 8 - HS</MenuItem>
            <MenuItem value={'geometry'}>Geometry</MenuItem>
            <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
            <MenuItem value={'statistics'}>Statistics</MenuItem>
            <MenuItem value={'everything'}>Everything</MenuItem>
          </Select>
        </InputContainer>
        {responseType === ResponseTypes.simple && (
          <Response
            mode={equationEditor}
            defaultResponse
            response={response}
            onResponseChange={this.onSimpleResponseChange}
          />
        )}
        {responseType === ResponseTypes.advanced &&
          responses.map((response, idx) => (
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
