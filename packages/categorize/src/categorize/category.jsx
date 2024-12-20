import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Choice from './choice';
import PlaceHolder from './droppable-placeholder';
import { color } from '@pie-lib/pie-toolbox/render-ui';

export const CategoryType = {
  id: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
};

export class Category extends React.Component {
  static propTypes = {
    ...CategoryType,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onDropChoice: PropTypes.func,
    onRemoveChoice: PropTypes.func,
    minRowHeight: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    const { classes, className, choices = [], disabled, onDropChoice, onRemoveChoice, id, correct, minRowHeight } = this.props;

    const names = classNames(classes.category, className);
    const placeholderNames = classNames(classes.placeholder, correct === false && classes.incorrect,
      correct === true && classes.correct);

    return (
      <div className={names}>
        <PlaceHolder onDropChoice={onDropChoice} disabled={disabled} className={placeholderNames} minRowHeight={minRowHeight}>
          {choices.map((c, index) => (
            <Choice
              onRemoveChoice={onRemoveChoice}
              disabled={disabled}
              key={index}
              choiceIndex={index}
              categoryId={id}
              {...c}
            />
          ))}
        </PlaceHolder>
      </div>
    );
  }
}

const styles = (theme) => ({
  incorrect: {
    border: `solid 2px ${color.incorrect()}`,
  },
  correct: {
    border: `solid 2px ${color.correct()}`
  },
  placeholder: {
    padding: theme.spacing.unit / 2,
    borderRadius: theme.spacing.unit / 2,
    gridColumnGap: 0,
    gridRowGap: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  category: {
    display: 'flex',
    flexDirection: 'column',
    flex: 2
  },
});

export default withStyles(styles)(Category);
