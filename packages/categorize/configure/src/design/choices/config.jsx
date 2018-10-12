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
import { InputCheckbox } from '@pie-lib/config-ui';

const positionOptions = [
  {
    label: 'Above',
    value: 'above',
    secondaryText: 'Choices will be shown above categories'
  },
  {
    label: 'Below',
    value: 'below',
    secondaryText: 'Choices will be shown below categories'
  },
  {
    label: 'Left',
    value: 'left',
    secondaryText: 'Choices will be shown to the left of the categories'
  },
  {
    label: 'Right',
    value: 'right',
    secondaryText: 'Choices will be shown to the right of the categories'
  }
];

const withDefaults = o => ({
  label: '',
  columns: 2,
  position: 'above',
  shuffle: false,
  ...o
});
export class Config extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    categoryCountIsOne: PropTypes.bool,
    onToggleCategoryCount: PropTypes.func
  };

  static defaultProps = {};

  state = {
    anchorEl: null
  };

  changeColumns = event => {
    const numberValue = parseInt(event.target.value, 10);

    if (numberValue && numberValue >= 1 && numberValue <= 4) {
      this.apply(config => (config.columns = numberValue));
    }
  };

  apply = fn => {
    const { onChange } = this.props;
    const config = withDefaults(this.props.config);
    fn(config);
    onChange(config);
  };

  changeLabel = event => {
    this.apply(config => (config.label = event.target.value));
  };

  toggleShuffle = () => {
    this.apply(config => (config.shuffle = !config.shuffle));
  };

  changePosition = position => {
    this.apply(config => (config.position = position.value));
    this.setState({ anchorEl: null });
  };

  handleClickPosition = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      className,
      categoryCountIsOne,
      onToggleCategoryCount
    } = this.props;

    const config = withDefaults(this.props.config);

    const positionOption =
      positionOptions.find(option => option.value === config.position) ||
      positionOption[1];

    return (
      <div className={classNames(classes.config, className)}>
        <div className={classes.row}>
          <TextField
            label={'Choices per row'}
            type="number"
            inputProps={{
              min: 1,
              max: 4
            }}
            value={config.columns}
            onChange={this.changeColumns}
          />
          <InputCheckbox
            label={'Remove all tiles after placing'}
            checked={categoryCountIsOne}
            onChange={onToggleCategoryCount}
          />
          <InputCheckbox
            className={classes.shuffleCheckbox}
            label={'Shuffle'}
            value={config.shuffle}
            onChange={this.toggleShuffle}
          />
        </div>

        <div className={classes.configuration}>
          <TextField
            className={classes.label}
            InputLabelProps={{
              shrink: true
            }}
            label="Label"
            value={config.label}
            onChange={this.changeLabel}
          />
          <List component="nav">
            <ListItem
              button
              aria-haspopup="true"
              onClick={this.handleClickPosition}
            >
              <ListItemText
                primary="Choices Position"
                secondary={positionOption.secondaryText}
              />
            </ListItem>
          </List>
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {positionOptions.map(option => (
              <MenuItem
                key={option.value}
                selected={option.value === config.position}
                onClick={() => this.changePosition(option)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
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
