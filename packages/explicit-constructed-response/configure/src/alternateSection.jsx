import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import Button from '@mui/material/Button';
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import max from 'lodash/max';
import EditableHtml from '@pie-lib/editable-html';
import { stripHtmlTags, getAdjustedLength, decodeHTML } from './markupUtils';

const DesignContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const AltChoices = styled('div')(({ theme }) => ({
  alignItems: 'flex-start',
  flexDirection: 'column',
  display: 'flex',
  paddingTop: theme.spacing(2.5),
  '& > *': {
    marginBottom: theme.spacing(2.5),
    width: '100%',
  },
}));

const StyledEditableHtml = styled(EditableHtml)(({ theme, hasError }) => ({
  flex: '1',
  marginRight: theme.spacing(2.5),
  ...(hasError && {
    border: `2px solid ${theme.palette.error.main}`,
    borderRadius: '6px',
  }),
}));

const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
  '& svg': {
    fill: theme.palette.grey[600],
  },
}));

const SelectContainer = styled('div')({
  alignItems: 'flex-end',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const RightContainer = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

const LengthField = styled(TextField)(({ theme }) => ({
  width: '230px',
  marginRight: theme.spacing(2.5),
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.divider,
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: theme.palette.text.primary,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.primary.main,
  },
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(0.5),
}));

const ChoiceWrapper = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
});

export class Choice extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    markup: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    value: PropTypes.string,
    spellCheck: PropTypes.bool,
    showMaxLength: PropTypes.bool,
    pluginProps: PropTypes.object,
  };

  state = {
    value: this.props.markup,
  };

  updateText = debounce(this.props.onChange, 300);

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.markup) {
      this.setState({ value: nextProps.markup });
    }
  }

  onChange = (e) => {
    const strippedValue = stripHtmlTags(e);
    this.setState({ value: strippedValue });
    this.updateText(strippedValue);
  };

  render() {
    const { value } = this.state;
    const { onDelete, spellCheck, error, showMaxLength, pluginProps } = this.props;
    const inputProps = showMaxLength ? {} : { maxLength: 25 };

    return (
      <React.Fragment>
        <ChoiceWrapper>
          <StyledEditableHtml
            hasError={!!error}
            disableUnderline
            onChange={this.onChange}
            markup={value || ''}
            activePlugins={['languageCharacters']}
            pluginProps={pluginProps}
            languageCharactersProps={[{ language: 'spanish' }]}
            spellCheck={spellCheck}
            autoWidthToolbar
            toolbarOpts={{
              minWidth: 'auto',
              isHidden: !!pluginProps?.characters?.disabled,
            }}
            {...inputProps}
          />
          <StyledDeleteButton
            aria-label="delete"
            onClick={onDelete}
            size="large">
            <Delete />
          </StyledDeleteButton>
        </ChoiceWrapper>
        {error && <ErrorText>{error}</ErrorText>}
      </React.Fragment>
    );
  }
}

export class AlternateSection extends React.Component {
  static propTypes = {
    choices: PropTypes.array,
    selectChoices: PropTypes.array.isRequired,
    errors: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    choiceChanged: PropTypes.func.isRequired,
    lengthChanged: PropTypes.func,
    choiceRemoved: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    showMaxLength: PropTypes.bool,
    spellCheck: PropTypes.bool,
    pluginProps: PropTypes.object,
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateChoicesIfNeeded(nextProps);
  }

  componentDidMount() {
    this.updateChoicesIfNeeded(this.props);
  }

  updateChoicesIfNeeded = (props) => {
    if (
      !this.state.choices ||
      !isEqual(props.choices, this.state.choices) ||
      !isEqual(props.choices, this.props.choices)
    ) {
      this.setState({
        choices: props.choices,
      });
    }
  };

  handleSelect = (e) => {
    const { onSelect, selectChoices } = this.props;
    const { value } = e.target;

    onSelect(selectChoices.find((c) => c.value === value));
  };

  onAddChoice = () => {
    const { choices } = this.state;

    if (choices.length && choices[choices.length - 1].label !== '') {
      const value = max(choices.map((c) => parseInt(c.value)).filter((id) => !isNaN(id))) || 0;

      this.setState({
        choices: [
          ...choices,
          {
            value: `${value + 1}`,
            label: '',
          },
        ],
      });
    }
  };

  onChoiceChanged = (choice, value, index) => {
    const { choiceChanged, lengthChanged, maxLength, choices } = this.props;

    const labelLengthsArr = choices.map((choice) => decodeHTML(choice.label || '').length);
    labelLengthsArr[index] =  decodeHTML(value).length;

    const newLength = Math.max(...labelLengthsArr);

    choiceChanged({
      ...choice,
      label: value,
    });

    if (newLength > maxLength || newLength + 10 <= maxLength) {
      lengthChanged(getAdjustedLength(newLength));
    }
  };

  onRemoveChoice = (choice) => {
    const { choiceRemoved } = this.props;

    choiceRemoved(choice.value);
  };

  getChoicesMaxLength = () => {
    const { choices } = this.state;

    if (!choices) {
      return 1;
    }

    const labelLengthsArr = choices.map((choice) => decodeHTML(choice.label || '').length);

    return Math.max(...labelLengthsArr);
  };

  changeLength = (event) => {
    const { lengthChanged } = this.props;
    const numberValue = parseInt(event.target.value, 10);
    const minLength = this.getChoicesMaxLength();

    if (numberValue && numberValue >= minLength && numberValue <= minLength + 10) {
      lengthChanged(numberValue);
    }
  };

  render() {
    const { selectChoices, maxLength, showMaxLength, value, spellCheck, errors, pluginProps } = this.props;
    const { choices } = this.state;
    const minLength = this.getChoicesMaxLength();

    return (
      <DesignContainer>
        <SelectContainer>
          <Select
            variant="standard"
            displayEmpty
            onChange={this.handleSelect}
            value={value || ''}
            readOnly={showMaxLength}
            MenuProps={{
              transitionDuration: { enter: 225, exit: 195 }
            }}
          >
            <MenuItem value="">
              <em>{value ? 'Remove selection' : 'Select a response'}</em>
            </MenuItem>
            {selectChoices.map((c, index) => (
              <MenuItem key={index} value={c?.value}>
                {decodeHTML(c?.label)}
              </MenuItem>
            ))}
          </Select>

          {choices && choices.length > 0 && (
            <RightContainer>
              {maxLength && showMaxLength && (
                <LengthField
                  variant="standard"
                  label="Maximum length (characters)"
                  type="number"
                  inputProps={{
                    min: minLength,
                    max: minLength + 10,
                  }}
                  value={maxLength}
                  onChange={this.changeLength}
                />
              )}
              <Button variant="contained" color="primary" onClick={this.onAddChoice}>
                Add
              </Button>
            </RightContainer>
          )}
        </SelectContainer>
        {errors && errors[0] && <ErrorText>{errors[0]}</ErrorText>}

        <AltChoices>
          {choices &&
            choices.map(
              (c, index) =>
                index > 0 && (
                  <Choice
                    key={index}
                    markup={c.label}
                    onChange={(val) => this.onChoiceChanged(c, val, index)}
                    onDelete={() => this.onRemoveChoice(c)}
                    spellCheck={spellCheck}
                    error={errors && errors[index]}
                    showMaxLength={showMaxLength}
                    pluginProps={pluginProps}
                  />
                ),
            )}
        </AltChoices>
      </DesignContainer>
    );
  }
}

export default AlternateSection;
