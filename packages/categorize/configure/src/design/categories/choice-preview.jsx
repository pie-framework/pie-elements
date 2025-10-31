import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import { Choice } from '@pie-lib/drag';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { HtmlAndMath } from '@pie-lib/render-ui';
import { color } from '@pie-lib/render-ui';

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
          <Choice
            alternateResponseIndex={alternateResponseIndex}
            category={category}
            choice={choice}
            choiceIndex={choiceIndex}
            className={classes.overflowChoice}
            onRemoveChoice={() => this.delete()}
          >
            <HtmlAndMath html={choice?.content} className={`${classes.breakWord}`} />
            <IconButton
              aria-label="delete"
              className={classNames(classes.delete, classes.customColor)}
              onClick={this.delete}
              size="large">
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
    overflow: 'auto',
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  breakWord: {
    maxWidth: '90%',
    wordBreak: 'break-all',
  },
  customColor: {
    color: `${color.tertiary()} !important`,
  },
  overflowChoice: {
    overflow: 'auto',
  },
});
export default withStyles(styles)(ChoicePreview);
