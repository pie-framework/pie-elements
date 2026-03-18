import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { removeChoiceFromAlternate } from '@pie-lib/categorize';

import Category from './category';

const CategoriesContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const CategoriesHolder = styled('div')(({ theme }) => ({
  display: 'grid',
  gridRowGap: `${theme.spacing(1)}px`,
  gridColumnGap: `${theme.spacing(1)}px`,
}));

const RowLabel = styled('div')({
  gridColumn: '1 / 3',
});

export class AlternateResponses extends React.Component {
  static propTypes = {
    altIndex: PropTypes.number.isRequired,
    configuration: PropTypes.object,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    categories: PropTypes.array,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    spellCheck: PropTypes.bool,
  };


  deleteChoiceFromCategory = (category, choice, choiceIndex) => {
    const { model, altIndex, onModelChanged } = this.props;

    const correctResponse = removeChoiceFromAlternate(
      choice.id,
      category.id,
      choiceIndex,
      altIndex,
      model.correctResponse,
    );

    onModelChanged({ correctResponse });
  };

  render() {
    const {
      altIndex,
      model,
      configuration,
      categories,
      imageSupport,
      spellCheck,
      uploadSoundSupport,
      mathMlOptions = {},
    } = this.props;
    const { categoriesPerRow, errors, rowLabels } = model;
    const { duplicateAlternate } = errors || {};

    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`,
    };
    const isDuplicated = duplicateAlternate ? duplicateAlternate.index === altIndex : false;

    return (
      <CategoriesContainer>
        <CategoriesHolder style={holderStyle}>
          {categories.map((category, index) => {
            const hasRowLabel = index % categoriesPerRow === 0;
            const rowIndex = index / categoriesPerRow;

            return (
              <React.Fragment key={index}>
                {hasRowLabel && (
                  <RowLabel
                    style={{
                      gridColumn: `1/${categoriesPerRow + 1}`,
                      width: '100%',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: rowLabels[rowIndex] || '',
                    }}
                  />
                )}

                <Category
                  key={index}
                  alternateResponseIndex={altIndex}
                  imageSupport={imageSupport}
                  isDuplicated={isDuplicated && duplicateAlternate.category === category.id}
                  category={category}
                  spellCheck={spellCheck}
                  onDeleteChoice={(choice, choiceIndex) => this.deleteChoiceFromCategory(category, choice, choiceIndex)}
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  configuration={configuration}
                  isAlternate={true}
                />
              </React.Fragment>
            );
          })}
        </CategoriesHolder>
      </CategoriesContainer>
    );
  }
}

export default AlternateResponses;
