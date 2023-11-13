import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Choice } from '@pie-lib/pie-toolbox/drag';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { HtmlAndMath } from '@pie-lib/pie-toolbox/render-ui';

export class ChoicePreview extends React.Component {
  static propTypes = {
    alternateResponseIndex: PropTypes.number,
    category: PropTypes.object,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choice: PropTypes.object.isRequired,
    choiceIndex: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  delete = () => {
    const { onDelete, choice } = this.props;
    onDelete(choice);
  };

  render() {
    const { alternateResponseIndex, category, classes, className, choice, choiceIndex } = this.props;
    return (
      <div className={classNames(classes.choicePreview, className)}>
        {choice ? (
          <Choice alternateResponseIndex={alternateResponseIndex} category={category} choice={choice} choiceIndex={choiceIndex} onRemoveChoice={() => this.delete()}>
            <HtmlAndMath html={choice?.content} className={`${classes.breakWord}`} />
            <IconButton color="secondary" aria-label="delete" className={classes.delete} onClick={this.delete}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Choice>
        ) : null}
      </div>
    );
  }
}
const styles = () => ({
  choicePreview: {
    position: 'relative',
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  breakWord: {
    maxWidth: '90%',
    wordWrap: 'break-word',
  }
});
export default withStyles(styles)(ChoicePreview);
