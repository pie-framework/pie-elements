import * as React from 'react';
import Static from '@pie-lib/math-toolbar/lib/mathquill/static';
import { withStyles } from '@material-ui/core/styles/index';
import PropTypes from 'prop-types';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    display: 'inline-flex',
    border: '2px solid grey'
  },
  response: {
    flex: 2,
    color: 'grey',
    background: 'lightgrey',
    fontSize: '0.8rem',
    padding: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '2px solid grey'
  },
  math: {
    color: '#bdbdbd',
    padding: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 8,
    '& > .mq-math-mode': {
      '& > .mq-hasCursor': {
        '& > .mq-cursor': {
          display: 'none'
        },
      }
    }
  }
});

class AnswerBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    latex: PropTypes.string.isRequired
  };

  static defaultProps = {
    latex: ''
  };

  render() {
    const { classes, latex, index } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.response}>R{index + 1}</div>
        <div className={classes.math}>
          <Static latex={latex} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AnswerBlock);
