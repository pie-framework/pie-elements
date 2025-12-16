import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

import GridContent from './grid-content';
import Category, { CategoryType } from './category';

export { CategoryType };

export class Categories extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape(CategoryType)),
    model: PropTypes.shape({
      categoriesPerRow: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    onDropChoice: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    rowLabels: PropTypes.array,
  };

  static defaultProps = {
    model: {
      categoriesPerRow: 1,
    },
  };

  render() {
    const { categories, model, disabled, onDropChoice, onRemoveChoice, rowLabels } = this.props;
    const { categoriesPerRow, minRowHeight } = model;

    // split categories into an array of arrays (inner array),
    // where each inner array represents how many categories should be displayed on one row
    const chunkedCategories = [];
    const cats = categories || [];
    for (let i = 0; i < cats.length; i += categoriesPerRow) {
      chunkedCategories.push(cats.slice(i, i + categoriesPerRow));
    }

    const hasNonEmptyString = (array) => {
      let found = false;

      (array || []).forEach((element) => {
        if (typeof element === 'string' && element.trim() !== '' && element.trim() !== '<div></div>') {
          found = true;
        }
      });

      return found;
    };

    return (
      <GridContent
        columns={categoriesPerRow}
        rows={Math.ceil(categories.length / categoriesPerRow) * 2}
        extraStyle={{ flex: 1 }}
      >
        {chunkedCategories.map((cat, rowIndex) => {
          let items = [];

          // for each inner array of categories, create a row with category titles
          // first cell of row has to be the row label
          cat.forEach((c, columnIndex) => {
            items.push(
              <div style={{ display: 'flex' }}>
                {columnIndex === 0 && hasNonEmptyString(rowLabels) ? (
                  <StyledRowLabel
                    key={rowIndex}
                    dangerouslySetInnerHTML={{
                      __html: rowLabels[rowIndex] || '',
                    }}
                  />
                ) : null}
                <StyledCategoryWrapper>
                  <StyledLabel
                    key={`category-label-${rowIndex}-${columnIndex}`}
                    dangerouslySetInnerHTML={{ __html: c.label }}
                  />

                  <Category
                    minRowHeight={minRowHeight}
                    onDropChoice={(h) => onDropChoice(c.id, h)}
                    onRemoveChoice={onRemoveChoice}
                    disabled={disabled}
                    key={`category-element-${rowIndex}-${columnIndex}`}
                    {...c}
                  />
                </StyledCategoryWrapper>
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

const StyledLabel = styled('div')(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.background(),
  textAlign: 'center',
  paddingTop: theme.spacing(1),
}));

const StyledRowLabel = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  flex: 0.5,
  marginRight: '12px',
});

const StyledCategoryWrapper = styled('div')({
  display: 'flex',
  flex: '2',
  flexDirection: 'column',
});

export default Categories;
