import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Category from './category';
import { moveChoiceToAlternate, removeChoiceFromAlternate } from '@pie-lib/pie-toolbox/categorize';
import { RowLabel } from './RowLabel';
import { getMaxCategoryChoices } from '../../utils';

const styles = (theme) => ({
  categories: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  categoriesHolder: {
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: `${theme.spacing.unit}px`,
    alignItems: 'baseline',
    width: '100%',
    marginTop: theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
  },
  rowLabel: {
    gridColumn: '1/3',
  },
  rowLabelHolder: {
    width: '100%',
  },
});

export class AlternateResponses extends React.Component {
  static propTypes = {
    altIndex: PropTypes.number.isRequired,
    configuration: PropTypes.object,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    categories: PropTypes.array,
    defaultImageMaxHeight: PropTypes.number,
    defaultImageMaxWidth: PropTypes.number,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

  addChoiceToCategory = (addedChoice, categoryId) => {
    const {
      altIndex,
      model: { correctResponse, choices, maxChoicesPerCategory = 0 },
      onModelChanged,
    } = this.props;

    const choice = choices.find((c) => c.id === addedChoice.id);

    correctResponse.forEach((a) => {
      if (a.category === categoryId) {
        a.alternateResponses = a.alternateResponses || [];

        if (!a.alternateResponses[altIndex]) {
          a.alternateResponses[altIndex] = [];
        }

        a.alternateResponses[altIndex].push(addedChoice.id);
        if (choice.categoryCount && choice.categoryCount !== 0) {
          a.alternateResponses[altIndex] = a.alternateResponses[altIndex].reduce((acc, currentValue) => {
            if (currentValue === choice.id) {
              const foundIndex = acc.findIndex((c) => c === choice.id);
              if (foundIndex === -1) {
                acc.push(currentValue);
              }
            } else {
              acc.push(currentValue);
            }

            return acc;
          }, []);
        }

        return a;
      } else {
        if (a.alternateResponses[altIndex] && choice.categoryCount !== 0) {
          a.alternateResponses[altIndex] = a.alternateResponses[altIndex].filter((c) => c !== addedChoice.id);
          return a;
        }
      }

      return a;
    });

    const maxCategoryChoices = getMaxCategoryChoices(this.props.model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    onModelChanged({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  moveChoice = (choiceId, from, to, choiceIndex, alternateIndex) => {
    const { model, onModelChanged } = this.props;
    let { choices, correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === choiceId);
    correctResponse = moveChoiceToAlternate(
      choiceId,
      from,
      to,
      choiceIndex,
      correctResponse,
      alternateIndex,
      choice?.categoryCount,
    );

    const maxCategoryChoices = getMaxCategoryChoices(this.props.model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    onModelChanged({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
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
      classes,
      className,
      categories,
      imageSupport,
      spellCheck,
      uploadSoundSupport,
      toolbarOpts,
      defaultImageMaxHeight,
      defaultImageMaxWidth,
      mathMlOptions = {},
    } = this.props;
    const { categoriesPerRow, errors, rowLabels } = model;
    const { duplicateAlternate } = errors || {};
    const { maxImageWidth = {}, maxImageHeight = {} } = configuration || {};

    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`,
    };
    const isDuplicated = duplicateAlternate ? duplicateAlternate.index === altIndex : false;

    return (
      <div className={classNames(classes.categories, className)}>
        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => {
            const hasRowLabel = index % categoriesPerRow === 0;
            const rowIndex = index / categoriesPerRow;

            return (
              <React.Fragment key={index}>
                {hasRowLabel && (
                  <div
                    style={{
                      gridColumn: `1/${categoriesPerRow + 1}`,
                      width: '100%',
                    }}
                    className={classes.rowLabel}
                    dangerouslySetInnerHTML={{
                      __html: rowLabels[rowIndex] || '',
                    }}
                  ></div>
                )}

                <Category
                  key={index}
                  alternateResponseIndex={altIndex}
                  imageSupport={imageSupport}
                  isDuplicated={isDuplicated && duplicateAlternate.category === category.id}
                  category={category}
                  spellCheck={spellCheck}
                  onAddChoice={this.addChoiceToCategory}
                  onDeleteChoice={(choice, choiceIndex) => this.deleteChoiceFromCategory(category, choice, choiceIndex)}
                  onMoveChoice={(choiceId, from, to, choiceIndex, alternateIndex) =>
                    this.moveChoice(choiceId, from, to, choiceIndex, alternateIndex)
                  }
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  configuration={configuration}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AlternateResponses);
