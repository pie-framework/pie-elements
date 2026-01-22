import React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/render-ui';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const BaseContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
}));

const StyledInputContainer = styled(InputContainer)({
  flex: 1,
  fontSize: 'inherit',
  width: '90%',
});

const StyledMenuItem = styled(MenuItem)(({ theme, isBlackColor }) => ({
  borderRadius: '2px',
  fontSize: 'inherit',
  height: '22px',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(2),
  ...(isBlackColor && {
    color: theme.palette.background.paper,
  }),
}));

const StyledSelect = styled(Select)({
  fontSize: 'inherit',
  transform: 'translate(0%, 40%)',
});

// TODO: Change Palette so will render inputs and colors dynamically
class Palette extends React.Component {
  onChange = (name) => (event) => {
    const { value } = event.target;
    const { onFillColorChange, onOutlineColorChange, onPaintColorChange } = this.props;

    if (name === 'fill') {
      onFillColorChange(value);
    } else if (name === 'outline') {
      onOutlineColorChange(value);
    } else {
      onPaintColorChange(value);
    }
  };

  render() {
    const { fillColor, outlineColor, fillList, outlineList, language } = this.props;

    return (
      <BaseContainer>
        <StyledInputContainer label={translator.t('drawingResponse.fillColor', { lng: language })}>
          <StyledSelect onChange={this.onChange('fill')} value={fillColor} variant='standard' MenuProps={{ transitionDuration: { enter: 225, exit: 195 } }}>
            {fillList.map(({ value, label }) => (
              <StyledMenuItem
                key={value}
                value={value}
                isBlackColor={value === 'black'}
                style={{ backgroundColor: value }}
              >
                {label}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </StyledInputContainer>

        <StyledInputContainer label={translator.t('drawingResponse.outlineColor', { lng: language })}>
          <StyledSelect onChange={this.onChange('outline')} value={outlineColor} variant='standard' MenuProps={{ transitionDuration: { enter: 225, exit: 195 } }}>
            {outlineList.map(({ value, label }) => (
              <StyledMenuItem key={value} value={value} style={{ border: `2px solid ${value}` }}>
                {label}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </StyledInputContainer>
      </BaseContainer>
    );
  }
}

Palette.propTypes = {
  fillColor: PropTypes.string.isRequired,
  fillList: PropTypes.array.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
  onOutlineColorChange: PropTypes.func.isRequired,
  onPaintColorChange: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  outlineList: PropTypes.array.isRequired,
  language: PropTypes.string,
};

export default Palette;
