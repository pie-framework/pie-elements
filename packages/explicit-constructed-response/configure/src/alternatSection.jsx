import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

export class AlternateSection extends React.Component {
  static propTypes = {
    choices: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    value: PropTypes.string
  };

  render() {
    const {
      classes,
      choices,
      value
    } = this.props;

    return (
      <div className={classes.design}>
        <Select
          className={classes.select}
          onChange={() => {}}
          value={value}
        >
          <MenuItem value={!choices.length ? value : ''}>
            <em>
              {!choices.length ? value : 'None'}
            </em>
          </MenuItem>
          {choices.map((c, index) => <MenuItem key={index} value={c.label}>{c.label}</MenuItem>)}
        </Select>
      </div>
    );
  }
}

const Styled = withStyles(styles)(AlternateSection);

export default Styled;