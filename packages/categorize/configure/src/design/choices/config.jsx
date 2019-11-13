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

export class Config extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    categoryCountIsOne: PropTypes.bool,
    allChoicesHaveCount: PropTypes.func,
    onModelChanged: PropTypes.func
  };

  static defaultProps = {};

  state = {
    anchorEl: null
  };

  toggleRemoveAllTiles = () => {
    const { config, onModelChanged } = this.props;

    const allAtOne = this.props.allChoicesHaveCount(1);
    const update = config.choices.map(c => {
      c.categoryCount = allAtOne ? 0 : 1;
      return c;
    });

    onModelChanged({ choices: update });
  };

  changeColumns = ({ target }) => {
    const { onModelChanged } = this.props;
    const numberValue = parseInt(target.value, 10);

    if (numberValue && numberValue >= 1 && numberValue <= 4) {
      onModelChanged({ choicesPerRow: numberValue });
    }
  };

  changeLabel = ({ target }) => {
    this.props.onModelChanged({ choicesLabel: target.value });
  };

  toggleShuffle = () => {
    this.props.onModelChanged({
      lockChoiceOrder: !this.props.config.lockChoiceOrder
    });
  };

  changePosition = position => {
    this.props.onModelChanged({ choicesPosition: position.value });

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
    const { classes, className, categoryCountIsOne, config } = this.props;

    const positionOption =
      positionOptions.find(option => option.value === config.choicesPosition) ||
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
            value={config.choicesPerRow}
            onChange={this.changeColumns}
          />
          <InputCheckbox
            label={'Remove all tiles after placing'}
            checked={categoryCountIsOne}
            onChange={this.toggleRemoveAllTiles}
          />
          <InputCheckbox
            className={classes.shuffleCheckbox}
            label={'Lock Choice Order'}
            value={config.lockChoiceOrder}
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
            value={config.choicesLabel}
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
                selected={option.value === config.choicesPosition}
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
