import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import classNames from 'classnames';
import Info from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import {
  moveChoiceToCategory,
  removeCategory,
  removeChoiceFromCategory,
  verifyAllowMultiplePlacements,
} from '@pie-lib/categorize';

import Category from './category';
import Header from '../header';
import { generateValidationMessage, getMaxCategoryChoices } from '../../utils';
import { RowLabel } from './RowLabel';
import { renderMath } from '@pie-lib/math-rendering';

const styles = (theme) => ({
  categories: {
    marginBottom: theme.spacing.unit * 3,
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
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit / 2,
  },
});

export class Categories extends React.Component {
  static propTypes = {
    defaultImageMaxHeight: PropTypes.number,
    defaultImageMaxWidth: PropTypes.number,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    categories: PropTypes.array,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    toolbarOpts: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

  state = {
    focusedEl: null,
  };

  componentDidMount() {
    try {
      // eslint-disable-next-line react/no-find-dom-node
      const domNode = ReactDOM.findDOMNode(this);

      renderMath(domNode);
    } catch (e) {
      // Added try-catch block to handle "Unable to find node on an unmounted component" error from tests, thrown because of the usage of shallow
      console.error('DOM not mounted');
    }
  }

  componentDidUpdate() {
    try {
      // eslint-disable-next-line react/no-find-dom-node
      const domNode = ReactDOM.findDOMNode(this);

      renderMath(domNode);
    } catch (e) {
      // Added try-catch block to handle "Unable to find node on an unmounted component" error from tests, thrown because of the usage of shallow
      console.error('DOM not mounted');
    }
  }

  add = () => {
    const { model, categories: oldCategories } = this.props;
    const { categoriesPerRow, correctResponse, allowAlternateEnabled } = model;

    const id = utils.firstAvailableIndex(
      model.categories.map((a) => a.id),
      1,
    );
    const data = { id, label: 'Category ' + id };
    const addRowLabel = model.categories.length % categoriesPerRow === 0;
    const rowLabels = [...model.rowLabels];

    if (addRowLabel) {
      rowLabels.push('');
    }

    this.setState(
      {
        focusedEl: oldCategories.length,
      },
      () => {
        this.props.onModelChanged({
          rowLabels,
          categories: model.categories.concat([data]),
          correctResponse: allowAlternateEnabled
            ? [...correctResponse, { category: id, choices: [], alternateResponses: [] }]
            : correctResponse,
        });
      },
    );
  };

  deleteFocusedEl = () => {
    this.setState({
      focusedEl: null,
    });
  };

  delete = (category) => {
    const { model, onModelChanged } = this.props;
    const index = model.categories.findIndex((a) => a.id === category.id);

    if (index !== -1) {
      model.categories.splice(index, 1);
      model.correctResponse = removeCategory(category.id, model.correctResponse);
      onModelChanged(model);
    }
  };

  change = (c) => {
    const { categories } = this.props;
    const index = categories.findIndex((a) => a.id === c.id);

    if (index !== -1) {
      categories.splice(index, 1, c);
      this.props.onModelChanged({ categories });
    }
  };

  addChoiceToCategory = (addedChoice, categoryId) => {
    const { model, onModelChanged } = this.props;
    let { choices = [], correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === addedChoice.id);
    correctResponse = moveChoiceToCategory(addedChoice.id, undefined, categoryId, 0, model.correctResponse);
    // if multiplePlacements not allowed, ensure the consistency in the other categories
    if (choice.categoryCount !== 0) {
      correctResponse = verifyAllowMultiplePlacements(addedChoice, categoryId, correctResponse);
    }
    const maxCategoryChoices = getMaxCategoryChoices(model);
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
    const { model, onModelChanged } = this.props;
    const correctResponse = removeChoiceFromCategory(choice.id, category.id, choiceIndex, model.correctResponse);

    onModelChanged({ correctResponse });
  };

  moveChoice = (choiceId, from, to, choiceIndex) => {
    const { model, onModelChanged } = this.props;
    let { choices, correctResponse = [], maxChoicesPerCategory = 0 } = model || {};
    const choice = (choices || []).find((choice) => choice.id === choiceId);
    if (to === from || !choice) {
      return;
    }
    if (choice.categoryCount !== 0) {
      correctResponse = moveChoiceToCategory(choice.id, from, to, choiceIndex, correctResponse);
      correctResponse = verifyAllowMultiplePlacements(choice, to, correctResponse);
    } else if (choice.categoryCount === 0) {
      correctResponse = moveChoiceToCategory(choice.id, undefined, to, 0, correctResponse);
    }
    const maxCategoryChoices = getMaxCategoryChoices(model);
    // when maxChoicesPerCategory is set to 0, there is no limit so it should not be updated
    onModelChanged({
      correctResponse,
      maxChoicesPerCategory:
        maxChoicesPerCategory !== 0 && maxChoicesPerCategory < maxCategoryChoices
          ? maxChoicesPerCategory + 1
          : maxChoicesPerCategory,
    });
  };

  changeRowLabel = (val, index) => {
    const { model } = this.props;
    const { rowLabels } = model;
    const newRowLabels = [...rowLabels];

    if (newRowLabels.length < index) {
      newRowLabels.push(val);
    } else {
      newRowLabels[index] = val;
    }

    this.props.onModelChanged({
      rowLabels: newRowLabels,
    });
  };

  render() {
    const {
      model,
      classes,
      className,
      categories,
      imageSupport,
      uploadSoundSupport,
      toolbarOpts,
      spellCheck,
      configuration,
      defaultImageMaxHeight,
      defaultImageMaxWidth,
      mathMlOptions = {},
    } = this.props;

    const { categoriesPerRow, rowLabels, errors } = model;
    const { associationError, categoriesError, categoriesErrors } = errors || {};
    const { maxCategories, maxImageWidth = {}, maxImageHeight = {} } = configuration || {};
    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`,
    };

    const validationMessage = generateValidationMessage(configuration);

    return (
      <div className={classNames(classes.categories, className)}>
        <Header
          label="Categories"
          buttonLabel="ADD A CATEGORY"
          onAdd={this.add}
          info={
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          buttonDisabled={maxCategories && categories && maxCategories === categories.length}
        />

        <div className={classes.categoriesHolder} style={holderStyle}>
          {categories.map((category, index) => {
            const hasRowLabel = index % categoriesPerRow === 0;
            const rowIndex = index / categoriesPerRow;

            return (
              <React.Fragment key={index}>
                {hasRowLabel && (
                  <RowLabel
                    categoriesPerRow={categoriesPerRow}
                    disabled={false}
                    rowIndex={rowIndex}
                    markup={rowLabels[rowIndex] || ''}
                    onChange={(val) => this.changeRowLabel(val, rowIndex)}
                    imageSupport={imageSupport}
                    toolbarOpts={toolbarOpts}
                    spellCheck={spellCheck}
                    maxImageWidth={(maxImageWidth && maxImageWidth.rowLabel) || defaultImageMaxWidth}
                    maxImageHeight={(maxImageHeight && maxImageHeight.rowLabel) || defaultImageMaxHeight}
                    uploadSoundSupport={uploadSoundSupport}
                    mathMlOptions={mathMlOptions}
                    configuration={configuration}
                  />
                )}

                <Category
                  imageSupport={imageSupport}
                  focusedEl={this.state.focusedEl}
                  deleteFocusedEl={this.deleteFocusedEl}
                  index={index}
                  category={category}
                  error={categoriesErrors && categoriesErrors[category.id]}
                  onChange={this.change}
                  onDelete={() => this.delete(category)}
                  onAddChoice={this.addChoiceToCategory}
                  onMoveChoice={(choiceId, from, to, choiceIndex) => this.moveChoice(choiceId, from, to, choiceIndex)}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheck}
                  onDeleteChoice={(choice, choiceIndex) => this.deleteChoiceFromCategory(category, choice, choiceIndex)}
                  maxImageWidth={(maxImageWidth && maxImageWidth.categoryLabel) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.categoryLabel) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  configuration={configuration}
                />
              </React.Fragment>
            );
          })}
        </div>

        {associationError && <div className={classes.errorText}>{associationError}</div>}
        {categoriesError && <div className={classes.errorText}>{categoriesError}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(Categories);
