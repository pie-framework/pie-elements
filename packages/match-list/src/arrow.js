import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ArrowHead from '@material-ui/icons/ArrowDropDown';
import { withStyles } from '@material-ui/core/styles';

export class Arrow extends React.Component {
  static propTypes = {
    direction: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  render() {
    const { direction, classes } = this.props;

    const extraStyle = direction === 'left'
      ? {}
      : {
        transform: 'rotate(180deg)'
      };

    return (
      <div
        className={classes.arrow}
        style={extraStyle}
      >
        <ArrowHead
          style={{
            transform: 'rotate(90deg)',
            color: '#979797',
            fontSize: 40
          }}
        />
        <span className={classnames(classes.line, {
          [classes.right]: direction !== 'left'
        })} />
      </div>
    );
  }
}

const styledArrow = withStyles({
  arrow: {
    display: 'inline-block',
    position: 'relative',
    width: '100%'
  },
  line: {
    backgroundColor: '#979797',
    bottom: 19,
    content: '""',
    display: 'block',
    height: 1,
    left: 20,
    position: 'absolute',
    width: '100%'
  },
  right: {
    bottom: 20
  }
})(Arrow);

export default styledArrow;
