import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Checkbox } from '@pie-lib/config-ui';


export class Config extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    onModelChanged: PropTypes.func
  };

  static defaultProps = {};


  changeLabel = ({ target }) => {
    this.props.onModelChanged({ choicesLabel: target.value });
  };


  render() {
    const { classes, className, config, spellCheck} = this.props;


    return (
      <div className={classNames(classes.config, className)}>
        <div className={classes.configuration}>
          <TextField
            className={classes.label}
            InputLabelProps={{
              shrink: true
            }}
            label="Label"
            value={config.choicesLabel}
            onChange={this.changeLabel}
            spellCheck={spellCheck}
          />
        </div>
      </div>
    );
  }
}
const styles = theme => ({
  configuration: {
    display: 'grid',
    alignItems: 'center',
    gridColumnGap: `${theme.spacing.unit}px`,
    gridRowGap: `${theme.spacing.unit}px`,
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit
  },
  choiceConfig: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  row: {
    display: 'grid',
    gridColumnGap: `${theme.spacing.unit}px`,
    gridRowGap: `${theme.spacing.unit}px`,
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  shuffleCheckbox: {
    gridColumnStart: 2,
    gridColumnEnd: 2
  }
});
export default withStyles(styles)(Config);
