import * as React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/config-ui';
import { MathToolbar } from '@pie-lib/math-toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { color } from '@pie-lib/render-ui';

const ResponseContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  width: '100%',
  minWidth: '548px',
  border: `1px solid ${theme.palette.grey[700]}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingBottom: `${theme.spacing(2)}px !important`,
}));

const StyledTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.2rem',
  flex: 3,
});

const StyledSelectContainer = styled(InputContainer)(({ theme }) => ({
  flex: 2,
  '& > *:not(label)': {
    marginTop: theme.spacing(1),
  },
}));

const InputContainerWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const TitleBar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FlexContainer = styled('div')({
  display: 'flex',
});

const AlternateButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey['A400']}`,
  color: color.text(),
}));

const RemoveAlternateButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

const ResponseBox = styled('div')(({ theme }) => ({
  background: theme.palette.grey['A100'],
  color: theme.palette.grey['A700'],
  display: 'inline',
  minWidth: '50px',
  padding: '8px',
  border: '1px solid #C0C3CF',
}));

const AlternateBar = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CustomColorCheckbox = styled(Checkbox)({
  color: `${color.tertiary()} !important`,
});

// CSS for MathToolbar classNames (used as strings)
if (typeof document !== 'undefined') {
  const styleId = 'math-templated-response-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .response-editor {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 500px;
        max-width: 900px;
        height: auto;
        min-height: 40px;
      }
      .math-toolbar {
        width: 100%;
      }
    `;
    document.head.appendChild(style);
  }
}

export class Response extends React.Component {
  static propTypes = {
    defaultResponse: PropTypes.bool,
    error: PropTypes.object,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onResponseChange: PropTypes.func.isRequired,
    onResponseDone: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    cIgnoreOrder: PropTypes.object.isRequired,
    cAllowTrailingZeros: PropTypes.object.isRequired,
    responseKey: PropTypes.number.isRequired,
  };

  static defaultProps = {
    defaultResponse: false,
    mode: '8',
  };

  constructor(props) {
    super(props);

    const { response: { alternates } = {} } = props || {};
    const alternatesLength = Object.keys(alternates || {}).length;

    this.state = {
      alternateIdCounter: alternatesLength + 1,
      showKeypad: {
        openCount: 0,
        main: false,
      },
    };
  }

  onChange = (name) => (evt) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.value;

    onResponseChange(newResponse, responseKey);
  };

  onConfigChanged = (name) => (evt) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.checked;

    onResponseChange(newResponse, responseKey);
  };

  onLiteralOptionsChange = (name) => () => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = !response[name];

    onResponseChange(newResponse, responseKey);
  };

  onAnswerChange = (answer) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse.answer = answer;

    onResponseChange(newResponse, responseKey);
  };

  onAlternateAnswerChange = (alternateId) => (answer) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse.alternates[alternateId] = answer;

    onResponseChange(newResponse, responseKey);
  };

  onAddAlternate = () => {
    const { response, onResponseChange, responseKey } = this.props;
    const { alternateIdCounter } = this.state;
    const newResponse = { ...response };

    if (!newResponse.alternates) {
      newResponse.alternates = {};
    }

    newResponse.alternates[alternateIdCounter] = '';

    onResponseChange(newResponse, responseKey);

    this.setState({
      alternateIdCounter: alternateIdCounter + 1,
    });
  };

  onRemoveAlternate = (alternateId) => () => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    delete newResponse.alternates[alternateId];

    onResponseChange(newResponse, responseKey);

    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount : state.showKeypad.openCount - 1,
      },
    }));
  };

  onDone = () => {
    const { onResponseDone } = this.props;
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        main: false,
      },
    }));

    onResponseDone();
  };

  onFocus = () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad.main ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        main: true,
      },
    }));
  };

  onAlternateFocus = (alternateId) => () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        [alternateId]: true,
      },
    }));
  };

  onAlternateDone = (alternateId) => () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        [alternateId]: false,
      },
    }));
  };

  render() {
    const { mode, responseKey, response, cAllowTrailingZeros, cIgnoreOrder, error } = this.props;
    const { showKeypad } = this.state;
    const { validation, answer, alternates, ignoreOrder, allowTrailingZeros } = response;
    const hasAlternates = Object.keys(alternates || {}).length > 0;
    const classNames = {
      editor: 'response-editor',
      mathToolbar: 'math-toolbar',
    };
    const styles = {
      minHeight: `${showKeypad.openCount > 0 ? 430 : 230}px`,
    };
    // add 1 to index to display R 1 instead of R 0
    const keyToDisplay = `R ${parseInt(responseKey) + 1}`;

    return (
      <ResponseContainer style={styles}>
        <StyledCardContent>
          <TitleBar>
            <StyledTitle component="div">
              Response for <ResponseBox>{keyToDisplay}</ResponseBox>
            </StyledTitle>

            <StyledSelectContainer label="Validation">
              <Select onChange={this.onChange('validation')} value={validation || 'literal'} MenuProps={{transitionDuration: { enter: 225, exit: 195 } }}>
                <MenuItem value="literal">Literal Validation</MenuItem>
                <MenuItem value="symbolic">Symbolic Validation</MenuItem>
              </Select>
            </StyledSelectContainer>
          </TitleBar>

          {validation === 'literal' && (
            <FlexContainer>
              {cAllowTrailingZeros.enabled && (
                <FormControlLabel
                  label={cAllowTrailingZeros.label}
                  control={
                    <CustomColorCheckbox
                      checked={allowTrailingZeros}
                      onChange={this.onLiteralOptionsChange('allowTrailingZeros')}
                    />
                  }
                />
              )}

              {cIgnoreOrder.enabled && (
                <FormControlLabel
                  label={cIgnoreOrder.label}
                  control={
                    <CustomColorCheckbox
                      checked={ignoreOrder}
                      onChange={this.onLiteralOptionsChange('ignoreOrder')}
                    />
                  }
                />
              )}
            </FlexContainer>
          )}

          <InputContainerWrapper>
            <InputLabel>Correct Answer</InputLabel>
            <MathToolbar
              keypadMode={mode}
              classNames={classNames}
              controlledKeypad
              showKeypad={showKeypad.main}
              latex={answer || ''}
              onChange={this.onAnswerChange}
              onFocus={this.onFocus}
              onDone={this.onDone}
              error={error && error.answer}
            />
            {error && error.answer ? <ErrorText>{error.answer}</ErrorText> : null}
          </InputContainerWrapper>

          {hasAlternates &&
            Object.keys(alternates).map((alternateId, altIdx) => (
              <InputContainerWrapper key={alternateId}>
                <InputLabel>
                  Alternate
                  {Object.keys(alternates).length > 1 ? ` ${altIdx + 1}` : ''}
                </InputLabel>
                <AlternateBar>
                  <MathToolbar
                    classNames={classNames}
                    controlledKeypad
                    keypadMode={mode}
                    showKeypad={showKeypad[alternateId] || false}
                    latex={alternates[alternateId] || ''}
                    onChange={this.onAlternateAnswerChange(alternateId)}
                    onFocus={this.onAlternateFocus(alternateId)}
                    onDone={this.onAlternateDone(alternateId)}
                    error={error && error[alternateId]}
                  />
                  <RemoveAlternateButton
                    onClick={this.onRemoveAlternate(alternateId)}
                    size="large">
                    <Delete />
                  </RemoveAlternateButton>
                </AlternateBar>
                {error && error[alternateId] ? <ErrorText>{error[alternateId]}</ErrorText> : null}
              </InputContainerWrapper>
            ))}

          <AlternateButton type="primary" onClick={this.onAddAlternate}>
            ADD ALTERNATE
          </AlternateButton>
        </StyledCardContent>
      </ResponseContainer>
    );
  }
}

export default Response;
