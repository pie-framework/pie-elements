import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import classNames from 'classnames';
import Category from './category';
import Header from '../header';
import { moveChoiceToCategory, removeCategory, removeChoiceFromCategory } from '@pie-lib/categorize';

export class Categories extends React.Component {
  static propTypes = {
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    categories: PropTypes.array,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired
  };

  changeCategoryColumns = event => {
    const numberValue = parseInt(event.target.value, 10);

    if (numberValue && numberValue >= 1 && numberValue <= 4) {
      this.props.onModelChanged({ categoriesPerRow: numberValue });
    }
  };

  add = () => {
    const { model } = this.props;
    const id = utils.firstAvailableIndex(model.categories.map(a => a.id), 0);
    const data = { id, label: 'Category ' + id };

    this.props.onModelChanged({ categories: model.categories.concat([data]) });
  };

  delete = category => {
    const { model, onModelChanged } = this.props;
    const index = model.categories.findIndex(a => a.id === category.id);

    if (index !== -1) {
      model.categories.splice(index, 1);
      model.correctResponse = removeCategory(
        category.id,
        model.correctResponse
      );
      onModelChanged(model);
    }
  };

  change = c => {
    const { categories } = this.props;
    const index = categories.findIndex(a => a.id === c.id);

    if (index !== -1) {
      categories.splice(index, 1, c);
      this.props.onModelChanged({ categories });
    }
  };

  addChoiceToCategory = (choice, categoryId) => {
    const { model, onModelChanged } = this.props;
    const correctResponse = moveChoiceToCategory(
      choice.id,
      undefined,
      categoryId,
      0,
      model.correctResponse
    );

    onModelChanged({ correctResponse });
  };

  deleteChoiceFromCategory = (category, choice, choiceIndex) => {
    const { model, onModelChanged } = this.props;
    const correctResponse = removeChoiceFromCategory(
      choice.id,
      category.id,
      choiceIndex,
      model.correctResponse
    );

    onModelChanged({ correctResponse });
  };

  render() {
    const {
      model,
      classes,
      className,
      categories,
      imageSupport
    } = this.props;
    const { categoriesPerRow } = model;

    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`
    };

    return (
      <div className={classNames(classes.categories, className)}>
        <Header label="Categories" buttonLabel="ADD A CATEGORY" onAdd={this.add} />
        <div className={classes.row}>
          <TextField
            label="Categories per row"
            type="number"
            inputProps={{
              min: 1,
              max: 4
            }}
            value={categoriesPerRow}
            onChange={this.changeCategoryColumns}
          />
        </div>
        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => (
            <Category
              key={index}
              imageSupport={imageSupport}
              category={category}
              onChange={this.change}
              onDelete={() => this.delete(category)}
              onAddChoice={this.addChoiceToCategory}
              onDeleteChoice={(choice, choiceIndex) =>
                this.deleteChoiceFromCategory(category, choice, choiceIndex)
              }
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
