import React from 'react';
import PropTypes from 'prop-types';
import DraggableCalculator from './draggable-calculator';
import CalculatorIcon from './calculator-icon';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = (theme) => ({
  icon: {
    transition: 'fill 200ms',
    cursor: 'pointer',
    verticalAlign: 'middle',
    fill: theme.palette.grey[600],
    '&:hover': {
      fill: theme.palette.common.black,
    },
  },
  active: {
    fill: theme.palette.common.black,
  },
});

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggleShow = () => this.setState({ show: !this.state.show });
  onClickClose = () => this.setState({ show: false });

  render() {
    const { show } = this.state;
    const { mode } = this.props.model;
    const { classes } = this.props;

    return (
      <div>
        <CalculatorIcon
          className={classNames(classes.icon, { [classes.active]: show })}
          onClick={() => this.onToggleShow()}
        />
        <DraggableCalculator mode={mode} show={show} onClose={this.onClickClose} />
      </div>
    );
  }
}

export default withStyles(styles)(Main);
