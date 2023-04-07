import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import InputHeader from '../input-header';
import CardActions from '@material-ui/core/CardActions';
import { DeleteButton } from '../buttons';

import PlaceHolder from './droppable-placeholder';

export class Category extends React.Component {
  static propTypes = {
    alternateResponseIndex: PropTypes.number,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    category: PropTypes.object.isRequired,
    defaultImageMaxHeight: PropTypes.number,
    defaultImageMaxWidth: PropTypes.number,
    deleteFocusedEl: PropTypes.func,
    focusedEl: PropTypes.number,
    index: PropTypes.number,
    error: PropTypes.string,
    isDuplicated: PropTypes.bool,
    maxImageWidth: PropTypes.object,
    maxImageHeight: PropTypes.object,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteChoice: PropTypes.func,
    onAddChoice: PropTypes.func,
    onMoveChoice: PropTypes.func,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    spellCheck: PropTypes.bool,
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {};

  changeLabel = (l) => {
    const { category, onChange } = this.props;
    category.label = l;
    onChange(category);
  };

  render() {
    const {
      alternateResponseIndex,
      category,
      classes,
      className,
      deleteFocusedEl,
      focusedEl,
      index,
      error,
      isDuplicated,
      onDelete,
      onDeleteChoice,
      onAddChoice,
      onMoveChoice,
      imageSupport,
      spellCheck,
      toolbarOpts,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
    } = this.props;
    return (
      <Card
        className={classNames(classes.category, className, {
          [classes.duplicateError]: isDuplicated,
        })}
      >
        <span>
          <InputHeader
            label={category.label}
            focusedEl={focusedEl}
            deleteFocusedEl={deleteFocusedEl}
            index={index}
            disabled={!!alternateResponseIndex || alternateResponseIndex === 0}
            error={error}
            onChange={this.changeLabel}
            onDelete={onDelete}
            imageSupport={imageSupport}
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheck}
            maxImageWidth={maxImageWidth}
            maxImageHeight={maxImageHeight}
            uploadSoundSupport={uploadSoundSupport}
          />
          {error && <div className={classes.errorText}>{error}</div>}
        </span>
        <PlaceHolder
          className={classes.placeHolder}
          alternateResponseIndex={alternateResponseIndex}
          category={category}
          choices={category.choices}
          onDeleteChoice={onDeleteChoice}
          onDropChoice={onAddChoice}
          onMoveChoice={onMoveChoice}
          categoryId={category.id}
        />
        {onDelete && (
          <CardActions className={classes.actions}>
            <DeleteButton label={'delete'} onClick={onDelete} />
          </CardActions>
        )}
      </Card>
    );
  }
}
const styles = (theme) => ({
  placeHolder: {
    minHeight: '100px',
  },
  deleteButton: {
    margin: 0,
  },
  actions: {
    padding: 0,
    paddingBottom: 0,
    paddingTop: theme.spacing.unit,
  },
  iconButtonRoot: {
    width: 'auto',
    height: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  category: {
    minWidth: '196px',
    padding: theme.spacing.unit,
    overflow: 'visible',
  },
  duplicateError: {
    border: '1px solid red',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
  editor: {
    flex: '1',
    paddingBottom: theme.spacing.unit * 2,
  },
});
export default withStyles(styles)(Category);
