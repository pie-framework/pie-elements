import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color } from '@pie-lib/render-ui';

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
      choicesPerRow: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    onDropChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
  };

  static defaultProps = {
    model: {
      categoriesPerRow: 1,
      choicesPerRow: 1
    }
  };

  render() {
    const {
      classes,
      categories,
      model,
      disabled,
      onDropChoice,
      onRemoveChoice,
    } = this.props;
    const { choicesPerRow, categoriesPerRow } = model;

    const columns = choicesPerRow / categoriesPerRow;

    // split categories into an array of arrays (inner array),
    // where each inner array represents how many categories should be displayed on one row
    const chunkedCategories = chunk(categories, categoriesPerRow);

    return (
      <GridContent
        columns={categoriesPerRow}
        className={classes.categories}
        rows={Math.ceil(categories.length / categoriesPerRow) * 2}
      >
        {
          chunkedCategories.map((cat, rowIndex) => {
            let items = [];

            // for each inner array of categories, create a row with category titles
            cat.forEach((c, columnIndex) => {
              items.push((
                <Typography className={classes.label} key={`category-label-${rowIndex}-${columnIndex}`}>
                  <span dangerouslySetInnerHTML={{ __html: c.label }}/>
                </Typography>));
            });

            // if the last row has less categories than max on a row, fill the spaces with divs
            items = items.concat(Array(categoriesPerRow - cat.length).fill(<div/>));

            // for each inner array of categories, create a row with category containers
            cat.forEach((c, columnIndex) => {
              const rows = Math.floor(c.choices.length / columns) + 1;

              items.push(<Category
                grid={{ rows, columns }}
                onDropChoice={h => onDropChoice(c.id, h)}
                onRemoveChoice={onRemoveChoice}
                disabled={disabled}
                className={classes.category}
                key={`category-element-${rowIndex}-${columnIndex}`}
                {...c}
              />);
            });

            // if the last row has less categories than max on a row, fill the spaces with divs
            items = items.concat(Array(categoriesPerRow - cat.length).fill(<div/>));

            return items;
          })
        }
      </GridContent>
    );
  }
}

const styles = theme => ({
  categories: {
    flex: 1
  },
  label: {
    color: color.text(),
    backgroundColor: color.background(),
    fontSize: theme.typography.fontSize,
    textAlign: 'center',
    paddingTop: theme.spacing.unit
  }
});
export default withStyles(styles)(Categories);
