import React from 'react';
import { Ruler } from '@pie-lib/tools';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toggle from './toggle';

const styles = {
  ruler: {
    position: 'absolute',
    left: '200px',
    zIndex: '101'
  }
};

export class Root extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggle = () => this.setState({ show: !this.state.show });

  render() {
    const { show } = this.state;
    const { classes, model } = this.props;
    return (
      <div>
        <Toggle active={show} onToggle={this.onToggle} />
        {show && (
          <Ruler
            className={classes.ruler}
            measure={model.measure}
            units={model.units}
            width={model.width}
            label={model.label}
            startPosition={{ left: 100, top: 100 }}
            tickCount={model.imperialTicks}
          />
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Root);
