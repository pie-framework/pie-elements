import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Choice } from '@pie-lib/drag';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { HtmlAndMath } from '@pie-lib/math-rendering';

export class ChoicePreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choice: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
  };
  static defaultProps = {};

  delete = () => {
    const { onDelete, choice } = this.props;
    onDelete(choice);
  };

  render() {
    const { classes, className, choice } = this.props;
    return (
      <div className={classNames(classes.choicePreview, className)}>
        <Choice>
          <HtmlAndMath html={choice.content} />
          <IconButton
            color="secondary"
            aria-label="delete"
            className={classes.delete}
            onClick={this.delete}
          >
            <Delete />
          </IconButton>
        </Choice>
      </div>
    );
  }
}
const styles = theme => ({
  choicePreview: {
    position: 'relative'
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0
  }
});
export default withStyles(styles)(ChoicePreview);
