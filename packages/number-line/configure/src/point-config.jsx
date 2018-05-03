import Button from 'material-ui/Button';
import React from 'react';
import { pointChooser } from '@pie-ui/number-line';
import { withStyles } from 'material-ui/styles';

const { Point } = pointChooser;

const styles = {
  displayToggles: {
    paddingTop: '20px'
  }
};

class PointConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: props.selection
    };
  }

  toggle(point) {
    this.state.selection[point] = !this.state.selection[point];
    this._stateUpdate();
  }

  toggleAll(value) {
    let display = PointConfig.types.reduce((acc, point) => {
      acc[point] = value;
      return acc;
    }, {});
    this.state.selection = display;
    this._stateUpdate();
  }

  _stateUpdate() {
    this.setState(
      {
        selection: this.state.selection
      },
      () => {
        this.props.onSelectionChange(this.state.selection);
      }
    );
  }

  active(point) {
    return this.state.selection[point] === true; // ? 'active' : '';
  }

  render() {
    const { classes } = this.props;

    const icons = PointConfig.types.map((point, key) => {
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
        <div className={classes.displayToggles}>
          <Button variant="raised" onClick={this.toggleAll.bind(this, true)}>
            Display All
          </Button>
          <Button variant="raised" onClick={this.toggleAll.bind(this, false)}>
            None
          </Button>
        </div>
      </div>
    );
  }
}

PointConfig.types = [
  'PF',
  'PE',
  'LFF',
  'LEF',
  'LFE',
  'LEE',
  'RFN',
  'RFP',
  'REN',
  'REP'
];

export default withStyles(styles, { name: 'PointConfig' })(PointConfig);
