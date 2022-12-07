import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Category from './category';

const styles = (theme) => ({
  categories: {
    marginBottom: theme.spacing.unit,
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
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    categories: PropTypes.array,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  addChoiceToCategory = (choice, categoryId) => {
    const {
      altIndex,
      model: { correctResponse },
      onModelChanged,
    } = this.props;

    correctResponse.forEach((a) => {
      if (a.category === categoryId) {
        a.alternateResponses = a.alternateResponses || [];

        if (!a.alternateResponses[altIndex]) {
          a.alternateResponses[altIndex] = [];
        }

        a.alternateResponses[altIndex].push(choice.id);

        return a;
      }

      return a;
    });

    onModelChanged({ correctResponse });
  };

  deleteChoiceFromCategory = (category, choice) => {
    const {
      altIndex,
      model: { correctResponse },
      onModelChanged,
    } = this.props;

    correctResponse.forEach((a) => {
      if (a.category === category.id) {
        if (a.alternateResponses[altIndex]) {
          a.alternateResponses[altIndex] = a.alternateResponses[altIndex].filter((altId) => altId !== choice.id);
        }
      }

      return a;
    });

    onModelChanged({ correctResponse });
  };

  render() {
    const {
      altIndex,
      model,
      classes,
      className,
      categories,
      imageSupport,
      spellCheck,
      uploadSoundSupport,
    } = this.props;
    const { categoriesPerRow, errors } = model;
    const { duplicateAlternate } = errors || {};

    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`,
    };
    const isDuplicated = duplicateAlternate ? duplicateAlternate.index === altIndex : false;

    return (
      <div className={classNames(classes.categories, className)}>
        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => (
            <Category
              key={index}
              imageSupport={imageSupport}
              isDuplicated={isDuplicated && duplicateAlternate.category === category.id}
              category={category}
              spellCheck={spellCheck}
              onAddChoice={this.addChoiceToCategory}
              onDeleteChoice={(choice, choiceIndex) => this.deleteChoiceFromCategory(category, choice, choiceIndex)}
              uploadSoundSupport={uploadSoundSupport}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AlternateResponses);
