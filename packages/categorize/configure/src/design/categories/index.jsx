import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { NumberTextField } from '@pie-lib/config-ui';
import Category from './category';
import Header from '../header';
import debug from 'debug';

const log = debug('@pie-element:categorize:configure');

export class Categories extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    columns: PropTypes.number.isRequired,
    onColumnsChange: PropTypes.func.isRequired,
    categories: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onDeleteChoice: PropTypes.func.isRequired,
    onAddChoice: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  static defaultProps = {
    columns: 2
  };

  changeCategory = c => {
    const { onChange, categories } = this.props;

    const index = categories.findIndex(a => a.id === c.id);
    if (index !== -1) {
      categories.splice(index, 1, c);
      onChange(categories);
    }
  };

  render() {
    const {
      columns,
      classes,
      className,
      onColumnsChange,
      onDeleteChoice,
      categories,
      onAdd,
      onDelete,
      onAddChoice
    } = this.props;

    const holderStyle = {
      gridTemplateColumns: `repeat(${1}, 1fr)`
    };

    return (
      <div className={classNames(classes.categories, className)}>
        <Header label="Categories" onAdd={onAdd} />
        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => (
            <Category
              key={index}
              category={category}
              onChange={this.changeCategory}
              onDelete={() => onDelete(category)}
              onDeleteChoice={(choice, choiceIndex) =>
                onDeleteChoice(category, choice, choiceIndex)
              }
              onAddChoice={onAddChoice}
            />
          ))}
        </div>
        <div className={classes.row}>
          <NumberTextField
            label="Categories per row"
            min={1}
            max={4}
            value={columns}
            onChange={onColumnsChange}
          />
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  categories: {
    marginBottom: theme.spacing.unit
  },
  categoriesHolder: {
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: `${theme.spacing.unit}px`,
    alignItems: 'baseline',
    width: '100%',
    justifyContent: 'space-between'
  }
});

export default withStyles(styles)(Categories);
