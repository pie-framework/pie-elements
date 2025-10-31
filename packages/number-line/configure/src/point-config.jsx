import Button from '@mui/material/Button';
import React from 'react';
import { pointChooser } from '@pie-element/number-line';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
const { Point } = pointChooser;

const styles = (theme) => ({
  displayToggles: {
    paddingTop: theme.spacing.unit * 2.5,
    '& > :first-child': {
      marginRight: theme.spacing.unit,
    },
  },
});

class PointConfig extends React.Component {
  static propTypes = {
    onSelectionChange: PropTypes.func,
    selection: PropTypes.object,
    classes: PropTypes.object,
    availableTools: PropTypes.array,
    hideButtons: PropTypes.bool,
  };
  constructor(props) {
    super(props);
  }

  toggle(point) {
    const update = { ...this.props.selection };
    update[point] = !update[point];
    this._propsUpdate(update);
  }

  toggleAll(value) {
    const display = [...PointConfig.types].reduce((acc, point) => {
      acc[point] = value;

      return acc;
    }, {});

    this._propsUpdate(display);
  }

  _propsUpdate(selection) {
    this.props.onSelectionChange(selection);
  }

  active(point) {
    return this.props.selection[point] === true; // ? 'active' : '';
  }

  render() {
    // Setting default value if not passed in configuration properties.
    const { classes, availableTools, hideButtons = false } = this.props;

    const icons = (availableTools || []).map((point) => {
      return (
        <Point
          iconKey={point.toLowerCase()}
          key={point.toLowerCase()}
          onClick={this.toggle.bind(this, point)}
          active={this.active(point)}
        />
      );
    });

    return (
      <div>
        <div>{icons}</div>
        <div className={classes.displayToggles} hidden={hideButtons}>
          <Button variant="outlined" size="small" onClick={this.toggleAll.bind(this, true)}>
            Select All
          </Button>
          <Button variant="outlined" size="small" onClick={this.toggleAll.bind(this, false)}>
            None
          </Button>
        </div>
      </div>
    );
  }
}

PointConfig.types = ['PF', 'LFF', 'LEF', 'LFE', 'LEE', 'RFN', 'RFP', 'REN', 'REP'];

export default withStyles(styles, { name: 'PointConfig' })(PointConfig);
