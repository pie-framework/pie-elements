import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Category from './category';
import Header from '../header';

export class Categories extends React.Component {
  static propTypes = {
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
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
      onAddChoice,
      imageSupport
    } = this.props;

    const holderStyle = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    };

    return (
      <div className={classNames(classes.categories, className)}>
        <Header label="Categories" buttonLabel="ADD A CATEGORY" onAdd={onAdd} />
        <div className={classes.row}>
          <TextField
            label="Categories per row"
            type="number"
            inputProps={{
              min: 1,
              max: 4
            }}
            value={columns}
            onChange={onColumnsChange}
          />
        </div>
        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => (
            <Category
              key={index}
              imageSupport={imageSupport}
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
    marginTop: theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit
  }
});

export default withStyles(styles)(Categories);
