import React from 'react';
import Calculator from '@pie-framework/material-ui-calculator';
import Draggable from 'react-draggable';
import Typography from '@material-ui/core/Typography';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';

const styles = theme => {
  const {
    palette: { secondary, primary }
  } = theme;

  const border = `solid 1px var(--pie-ui, ${grey[900]})`;

  return {
    baseLayout: {
      display: 'inline-block',
      border,
      zIndex: '10'
    },
    scientific: {
      minWidth: '515px'
    },
    closeIcon: {
      width: '24px',
      height: '24px',
      color: 'white'
    },
    title: {
      color: secondary.contrastText,
      flex: 1
    },
    titleBar: {
      cursor: 'move',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing.unit,
      backgroundColor: primary.light,
      borderBottom: border
    }
  };
};

class BaseLayout extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['basic', 'scientific'])
  };

  render() {
    const { classes, onClose, mode, className } = this.props;
    return (
      <div
        className={classNames(
          classes.baseLayout,
          mode === 'scientific' && classes.scientific,
          className
        )}
      >
        <div className={`handle ${classes.titleBar}`}>
          <Typography variant="subheading" className={classes.title}>
            Calculator
          </Typography>
          <IconButton
            className={classes.closeIcon}
            onClick={onClose}
            aria-label="Delete"
          >
            <Close />
          </IconButton>
        </div>
        <Calculator mode={mode} />
      </div>
    );
  }
}

export const CalculatorLayout = withStyles(styles)(BaseLayout);

export class DraggableCalculator extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['basic', 'scientific']),
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      deltaPosition: {
        x: 0,
        y: 0
      }
    };
  }

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  };

  render() {
    const { mode, show, onClose, classes } = this.props;
    const { x, y } = this.state.deltaPosition;
    return show ? (
      <Draggable
        onDrag={this.handleDrag}
        defaultPosition={{ x, y }}
        handle=".handle"
      >
        {/* draggable needs to have a div as the first child so it can find the classname. */}
        <div>
          <CalculatorLayout
            onClose={onClose}
            mode={mode}
            className={classes.draggable}
          />
        </div>
      </Draggable>
    ) : null;
  }
}

export default withStyles(() => ({
  draggable: {
    position: 'absolute'
  }
}))(DraggableCalculator);
