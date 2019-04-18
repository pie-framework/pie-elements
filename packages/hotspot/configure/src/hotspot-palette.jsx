import React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/config-ui';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

class Palette extends React.Component {
  onChange = (name) => event => {
    const { value } = event.target;
    const { onHotspotColorChange, onOutlineColorChange } = this.props;

    if (name === 'hotspot') {
      onHotspotColorChange(value);
    } else {
      onOutlineColorChange(value)
    }
  };

  render() {
    const { classes, hotspotColor, outlineColor, hotspotList, outlineList } = this.props;

    return (
      <div className={classes.container}>
        <InputContainer label="Hot Spot" className={classes.input}>
          <Select
            className={classes.select}
            onChange={this.onChange('hotspot')}
            value={hotspotColor}
          >
            {hotspotList.map(hotspot => (
              <MenuItem
                key={hotspot}
                value={hotspot}
                className={classes.item}
                style={{ backgroundColor: hotspot }}
              >
                {hotspot}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
        <InputContainer label="Response Outline" className={classes.input}>
          <Select
            className={classes.select}
            onChange={this.onChange('outline')}
            value={outlineColor}
          >
            {outlineList.map(outline => (
              <MenuItem
                key={outline}
                value={outline}
                className={classes.item}
                style={{ border: `2px solid ${outline}` }}
              >
                {outline}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex'
  },
  input: {
    flex: 1,
    width: '90%'
  },
  item: {
    borderRadius: '2px',
    height: '22px',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
});

Palette.propTypes = {
  classes: PropTypes.object.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  hotspotList: PropTypes.string.isRequired,
  onHotspotColorChange: PropTypes.func.isRequired,
  onOutlineColorChange: PropTypes.func.isRequired,
  outlineColor: PropTypes.shape([]).isRequired,
  outlineList: PropTypes.shape([]).isRequired
};

export default withStyles(styles)(Palette);
