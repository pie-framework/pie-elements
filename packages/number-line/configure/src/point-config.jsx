import Button from '@material-ui/core/Button';
import React from 'react';
import { pointChooser } from '@pie-element/number-line';
import { withStyles } from '@material-ui/core/styles';
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
    this.state = {
      selection: props.selection,
    };
  }

  toggle(point) {
    const update = { ...this.state.selection };
    update[point] = !update[point];
    this._stateUpdate(update);
  }

  toggleAll(value) {
    const display = [...PointConfig.types].reduce((acc, point) => {
      acc[point] = value;

      return acc;
    }, {});

    this._stateUpdate(display);
  }

  _stateUpdate(selection) {
    this.setState({ selection }, () => {
      this.props.onSelectionChange(this.state.selection);
    });
  }

  active(point) {
    return this.state.selection[point] === true; // ? 'active' : '';
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
