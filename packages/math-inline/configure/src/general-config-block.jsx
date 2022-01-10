import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Response from './response';
import { MathToolbar } from '@pie-lib/math-toolbar';
import isEqual from 'lodash/isEqual';
import { ResponseTypes } from './utils';
import MathQuill from '@pie-framework/mathquill';

let registered = false;

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
  },
  templateTitle: {
    fontSize: '0.85rem',
  },
  addResponseButton: {
    border: '1px solid lightgrey',
    float: 'right',
    width: '150px',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectContainer: {
    flex: 'initial',
    width: '40%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  inputContainer: {
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  responseEditor: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    minWidth: '500px',
    maxWidth: 'inherit',
    height: 'auto',
    minHeight: '130px',
    textAlign: 'left',
    padding: theme.spacing.unit,
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: '600px',
  },
  blockContainer: {
    margin: theme.spacing.unit,
    display: 'inline-flex',
    border: '2px solid grey',
  },
  blockContainerGeneric: {
    margin: theme.spacing.unit / 2,
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
    borderRight: '2px solid grey',
  },
  blockResponseGeneric: {
    borderRight: 0,
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
          display: 'none',
        },
      },
    },
  },
});

const REGEX = /{{response}}/gm;
const TEMPORARY_RESPONSE_FIELD = /\\%response\\%/gm;
const ANSWER_BLOCK_REGEX = /\\embed\{answerBlock\}\[r\d*\]/g;
const NEWLINE_BLOCK = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = /\\newline/g;

function prepareForStatic(expression) {
  if (expression) {
    let answerBlocks = 1; // assume one at least

    return expression.replace(
      REGEX,
      () => `\\embed{answerBlock}[r${answerBlocks++}]`
    ).replace(NEWLINE_LATEX, '\\embed{newLine}[]');
  }
}

function prepareForModel(expression) {
  if (expression) {
    return expression
      .replace(ANSWER_BLOCK_REGEX, () => '{{response}}')
      .replace(TEMPORARY_RESPONSE_FIELD, () => '{{response}}')
      .replace(NEWLINE_BLOCK, () => '\\newline');
  }
}

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    imageSupport: PropTypes.object,
    configuration: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    promptEnabled: PropTypes.bool,
    rationaleEnabled: PropTypes.bool,
    toolbarOpts: PropTypes.object
  };

  constructor(props) {
    super(props);

    const responseAreas = {};

    if (props.model && props.model.expression) {
      let answerBlocks = 1; // assume one at least
      // build out local state model using responses declared in expression

      props.model.expression.replace(REGEX, () => {
        responseAreas[`r${answerBlocks++}`] = {
          value: '',
        };
      });
    }

    this.state = {
      showKeypad: false,
      responseAreas,
      responseIdCounter: Object.keys(responseAreas).length,
    };
  }

  onChange = (name) => (evtOrValue) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    if (typeof evtOrValue === 'object') {
      newModel[name] = evtOrValue.target.value;
    } else {
      newModel[name] = evtOrValue;
    }

    if (name === 'expression') {
      newModel[name] = prepareForModel(evtOrValue);
    }

    onChange(newModel);
  };

  onDone = () => {
    this.setState({ showKeypad: false });
  };

  onFocus = () => {
    this.setState({ showKeypad: true });
  };

  onPromptFocus = () => {
    this.setState({ showKeypad: false });
  };

  UNSAFE_componentWillMount() {
    const { classes } = this.props;

    if (typeof window !== 'undefined') {
      // const MathQuill = require('@pie-framework/mathquill');
      let MQ = MathQuill.getInterface(2);

      if (!registered) {
        MQ.registerEmbed('answerBlock', (data) => {
          // not used until we implement individual answer tracking
          // const individualAnswerBlock = `<div class="${classes.blockContainer}">
          //     <div class="${classes.blockResponse}" id="${data}Index">R</div>
          //     <div class="${classes.blockMath}">
          //        <span id="${data}"></span>
          //      </div>
          //   </div>`;

          const genericAnswerBlock = `<div class="${cx(
            classes.blockContainer,
            classes.blockContainerGeneric
          )}">
                <div class="${cx(
            classes.blockResponse,
            classes.blockResponseGeneric
          )}" id="${data}Index">Response</div>
              </div>`;

          return {
            htmlString: genericAnswerBlock,
            text: () => 'text',
            latex: () => `\\embed{answerBlock}[${data}]`,
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

    const responseAreas = {};

    if (model && model.expression) {
      let answerBlocks = 1; // assume one at least
      // build out local state model using responses declared in expression

      model.expression.replace(REGEX, () => {
        responseAreas[`r${answerBlocks++}`] = {
          value: '',
        };
      });
    }

    if (!isEqual(responseAreas, this.state.responseAreas)) {
      this.setState(
        {
          responseAreas,
        },
        () => {
          if (this.root && Object.keys(responseAreas).length) {
            Object.keys(responseAreas).forEach((responseId, idx) => {
              const el = this.root.querySelector(`#${responseId}`);
              const indexEl = this.root.querySelector(`#${responseId}Index`);

              if (el) {
                // const MathQuill = require('@pie-framework/mathquill');
                let MQ = MathQuill.getInterface(2);
                // We no longer have individual answers, so we cannot set text content of blocks
                // el.textContent = response.answer;
                MQ.StaticMath(el);
                indexEl.textContent = `R${idx + 1}`;
              }
            });
          }
        }
      );
    }
  };

  onAddResponse = () => {
    const { model, onChange } = this.props;
    const { responseIdCounter } = this.state;
    const newModel = { ...model };

    let newCounter = responseIdCounter;

    while (model.responses.find((response) => response.id === newCounter)) {
      newCounter++;
    }

    const response = {
      id: newCounter,
      validation: 'literal',
      answer: '',
      alternates: {},
    };

    newModel.responses = newModel.responses.concat(response);
    onChange(newModel);

    this.setState({
      responseIdCounter: response.id,
    });
  };

  onResponseChange = (response, index) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.responses[index] = response;
    onChange(newModel);
  };

  render() {
    const {
      classes,
      model,
      imageSupport,
      configuration,
      promptEnabled,
      rationaleEnabled,
      toolbarOpts
    } = this.props;
    const { showKeypad } = this.state;
    const {
      prompt,
      expression,
      equationEditor,
      promptEquationEditor = '8',
      responses,
      responseType,
      rationale,
    } = model;
    const { rationale: cRationale = {}, prompt: cPrompt = {}, ignoreOrder: cIgnoreOrder = {}, allowTrailingZeros: cAllowTrailingZeros = {} } = configuration || {};

    const classNames = {
      editor: classes.responseEditor,
      mathToolbar: classes.mathToolbar,
    };

    const responsesToUse =
      responseType === ResponseTypes.advanced
        ? responses
        : responses.slice(0, 1);

    return (
      <div
        ref={(r) => (this.root = r || this.root)}
        className={classes.container}
      >
        {promptEnabled && (
          <InputContainer label={cPrompt.label} className={classes.promptHolder}>
            <EditableHtml
              onFocus={this.onPromptFocus}
              className={classes.prompt}
              markup={prompt || ''}
              onChange={this.onChange('prompt')}
              imageSupport={imageSupport}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
            />
          </InputContainer>
        )}
        {rationaleEnabled && (
          <InputContainer
            label={cRationale.label}
            className={classes.promptHolder}
          >
            <EditableHtml
              className={classes.prompt}
              markup={rationale || ''}
              pluginProps={{
                math: {
                  controlledKeypadMode: false
                }
              }}
              onChange={this.onChange('rationale')}
              imageSupport={imageSupport}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
            />
          </InputContainer>
        )}
        {responseType === ResponseTypes.advanced && ([
          <InputContainer
            key="templateEditorType"
            label="Response Template Equation Editor"
            className={classes.selectContainer}
          >
            <Select
              className={classes.select}
              onChange={this.onChange('promptEquationEditor')}
              value={promptEquationEditor}
            >
              <MenuItem value="non-negative-integers">Numeric - Non-Negative Integers</MenuItem>
              <MenuItem value="integers">Numeric - Integers</MenuItem>
              <MenuItem value="decimals">Numeric - Decimals</MenuItem>
              <MenuItem value="fractions">Numeric - Fractions</MenuItem>
              <MenuItem value={1}>Grade 1 - 2</MenuItem>
              <MenuItem value={3}>Grade 3 - 5</MenuItem>
              <MenuItem value={6}>Grade 6 - 7</MenuItem>
              <MenuItem value={8}>Grade 8 - HS</MenuItem>
              <MenuItem value={'geometry'}>Geometry</MenuItem>
              <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
              <MenuItem value={'statistics'}>Statistics</MenuItem>
              <MenuItem value={'item-authoring'}>Item Authoring</MenuItem>
            </Select>
          </InputContainer>,
          <div className={classes.inputContainer} key="templateHolder">
            <InputLabel className={classes.templateTitle}>
              RESPONSE TEMPLATE
            </InputLabel>
            <MathToolbar
              classNames={classNames}
              allowAnswerBlock
              keypadMode={promptEquationEditor}
              controlledKeypad
              showKeypad={showKeypad}
              latex={prepareForStatic(expression) || ''}
              onChange={this.onChange('expression')}
              onFocus={this.onFocus}
              onDone={this.onDone}
            />
          </div>
        ])}
        <h3>Define Correct Response</h3>
        <div className={classes.flexContainer}>
          <InputContainer
            label="Equation Editor"
            className={classes.selectContainer}
          >
            <Select
              className={classes.select}
              onChange={this.onChange('equationEditor')}
              value={equationEditor}
            >
              <MenuItem value="non-negative-integers">Numeric - Non-Negative Integers</MenuItem>
              <MenuItem value="integers">Numeric - Integers</MenuItem>
              <MenuItem value="decimals">Numeric - Decimals</MenuItem>
              <MenuItem value="fractions">Numeric - Fractions</MenuItem>
              <MenuItem value={1}>Grade 1 - 2</MenuItem>
              <MenuItem value={3}>Grade 3 - 5</MenuItem>
              <MenuItem value={6}>Grade 6 - 7</MenuItem>
              <MenuItem value={8}>Grade 8 - HS</MenuItem>
              <MenuItem value={'geometry'}>Geometry</MenuItem>
              <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
              <MenuItem value={'statistics'}>Statistics</MenuItem>
              <MenuItem value={'item-authoring'}>Item Authoring</MenuItem>
            </Select>
          </InputContainer>
        </div>
        {responsesToUse.map((response, idx) => (
          <Response
            key={response.id}
            mode={equationEditor}
            response={response}
            defaultResponse={responseType === ResponseTypes.simple}
            onResponseChange={this.onResponseChange}
            index={idx}
            cIgnoreOrder={cIgnoreOrder}
            cAllowTrailingZeros={cAllowTrailingZeros}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
