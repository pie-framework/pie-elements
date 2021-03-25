import React from 'react';
import { Protractor } from '@pie-lib/tools';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toggle from './toggle';

const styles = {
  protractor: {
    position: 'absolute',
    left: '200px'
  }
};

class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggle = () => this.setState({ show: !this.state.show });

  render() {
    const { show } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Toggle active={show} onToggle={this.onToggle} />
        {show && (
          <Protractor
            className={classes.protractor}
            startPosition={{ left: 100, top: 100 }}
          />
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Main);
