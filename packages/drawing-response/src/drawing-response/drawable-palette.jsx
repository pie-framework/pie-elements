import React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/render-ui';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';
import classnames from 'classnames';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

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
    const { classes, fillColor, outlineColor, fillList, outlineList, language } = this.props;

    return (
      <div className={classes.base}>
        <InputContainer label={translator.t('drawingResponse.fillColor', { lng: language })} className={classes.input}>
          <Select className={classes.select} onChange={this.onChange('fill')} value={fillColor}>
            {fillList.map(({ value, label }) => (
              <MenuItem
                key={value}
                value={value}
                className={classnames(classes.item, {
                  [classes.blackColorItem]: value === 'black',
                })}
                style={{ backgroundColor: value }}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>

        <InputContainer
          label={translator.t('drawingResponse.outlineColor', { lng: language })}
          className={classes.input}
        >
          <Select className={classes.select} onChange={this.onChange('outline')} value={outlineColor}>
            {outlineList.map(({ value, label }) => (
              <MenuItem key={value} value={value} className={classes.item} style={{ border: `2px solid ${value}` }}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
      </div>
    );
  }
}

const styles = (theme) => ({
  base: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
  },
  input: {
    flex: 1,
    fontSize: 'inherit',
    width: '90%',
  },
  item: {
    borderRadius: '2px',
    fontSize: 'inherit',
    height: '22px',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  blackColorItem: {
    color: theme.palette.background.paper,
  },
  select: {
    fontSize: 'inherit',
    transform: 'translate(0%, 40%)',
  },
});

Palette.propTypes = {
  classes: PropTypes.object.isRequired,
  fillColor: PropTypes.string.isRequired,
  fillList: PropTypes.array.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
  onOutlineColorChange: PropTypes.func.isRequired,
  onPaintColorChange: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  outlineList: PropTypes.array.isRequired,
  language: PropTypes.string,
};

export default withStyles(styles)(Palette);
