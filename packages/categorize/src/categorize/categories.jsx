import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color } from '@pie-lib/pie-toolbox/render-ui';

import chunk from 'lodash/chunk';

import GridContent from './grid-content';
import Category, { CategoryType } from './category';

export { CategoryType };

export class Categories extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape(CategoryType)),
    model: PropTypes.shape({
      categoriesPerRow: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    onDropChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    rowLabels: PropTypes.array
  };

  static defaultProps = {
    model: {
      categoriesPerRow: 1,
    },
  };

  render() {
    const { classes, categories, model, disabled, onDropChoice, onRemoveChoice, rowLabels } = this.props;
    const { categoriesPerRow, minRowHeight } = model;

    // split categories into an array of arrays (inner array),
    // where each inner array represents how many categories should be displayed on one row
    const chunkedCategories = chunk(categories, categoriesPerRow);

    const hasNonEmptyString = (array) => {
      let found = false;

      (array || []).forEach(element => {
        if (typeof element === 'string' && element.trim() !== '' && element.trim() !== '<div></div>') {
          found = true;
        }
      });

      return found;
    };

    return (
      <GridContent
        columns={categoriesPerRow}
        className={classes.categories}
        rows={Math.ceil(categories.length / categoriesPerRow) * 2}
      >
        {chunkedCategories.map((cat, rowIndex) => {
          let items = [];

          // for each inner array of categories, create a row with category titles
          // first cell of row has to be the row label
          cat.forEach((c, columnIndex) => {
            items.push(
              <div style={{ display: 'flex' }}>
                {columnIndex === 0 && hasNonEmptyString(rowLabels) ? (
                  <div
                    key={rowIndex}
                    className={classes.rowLabel}
                    dangerouslySetInnerHTML={{
                      __html: rowLabels[rowIndex] || '',
                    }}
                  />
                ) : null}
                <div className={classes.categoryWrapper}>
                  <div
                    className={classes.label}
                    key={`category-label-${rowIndex}-${columnIndex}`}
                    dangerouslySetInnerHTML={{ __html: c.label }}
                  />

                  <Category
                    minRowHeight={minRowHeight}
                    onDropChoice={(h) => onDropChoice(c.id, h)}
                    onRemoveChoice={onRemoveChoice}
                    disabled={disabled}
                    className={classes.category}
                    key={`category-element-${rowIndex}-${columnIndex}`}
                    {...c}
                  />
                </div>
              </div>,
            );
          });

          // if the last row has fewer categories than max on a row, fill the spaces with divs
          items = items.concat(
            Array(categoriesPerRow - cat.length)
              .fill(<div />)
              .map((value, index) => <div key={`fill-space-final-${index}`} />),
          );

          return items;
        })}
      </GridContent>
    );
  }
}

const styles = (theme) => ({
  categories: {
    flex: 1,
  },
  label: {
    color: color.text(),
    backgroundColor: color.background(),
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
  rowLabel: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flex: 0.5,
    marginRight: '12px',
  },
  categoryWrapper: {
    display: 'flex',
    flex: '2',
    flexDirection: 'column',
  },
});
export default withStyles(styles)(Categories);
