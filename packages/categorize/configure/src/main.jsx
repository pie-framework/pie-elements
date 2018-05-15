import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { Tabs } from '@pie-lib/config-ui';
import Design from './design';
import Scoring from './scoring';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {};
  render() {
    const { classes, className } = this.props;
    return (
      <div className={classNames(classes.main, className)}>
        <Tabs>
          <Design />
          <Scoring />
        </Tabs>
      </div>
    );
  }
}
const styles = theme => ({
  main: {}
});
export default withStyles(styles)(Main);
