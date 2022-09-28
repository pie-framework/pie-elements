import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import classNames from 'classnames';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import { moveChoiceToCategory, removeCategory, removeChoiceFromCategory } from '@pie-lib/categorize';

import Category from './category';
import Header from '../header';
import { generateValidationMessage } from '../../utils';

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
  },
  rowLabel: {
    gridColumn: '1/3'
  },
  rowLabelHolder: {
    width: '100%'
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    padding: '5px 0'
  },
});

const RowLabel = withStyles(styles)(({ categoriesPerRow, classes, markup, imageSupport, onChange, toolbarOpts, spellCheck, maxImageWidth, maxImageHeight, uploadSoundSupport}) => {
  return (
    <div
      style={{
        gridColumn: `1/${categoriesPerRow + 1}`,
        width: '100%'
      }}
    >
      <Typography className={classes.text}>
        Row Label
      </Typography>
      <EditableHtml
        className={classes.rowLabelHolder}
        markup={markup}
        onChange={onChange}
        imageSupport={imageSupport}
        nonEmpty={false}
        toolbarOpts={toolbarOpts}
        spellCheck={spellCheck}
        maxImageWidth={maxImageWidth}
        maxImageHeight={maxImageHeight}
        uploadSoundSupport={uploadSoundSupport}
      />
    </div>
  );
});

export class Categories extends React.Component {
  static propTypes = {
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    categories: PropTypes.array,
    onModelChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    toolbarOpts: PropTypes.object
  };

  changeCategoryColumns = event => {
    const numberValue = parseInt(event.target.value, 10);

    if (numberValue && numberValue >= 1 && numberValue <= 4) {
      this.props.onModelChanged({ categoriesPerRow: numberValue });
    }
  };

  add = () => {
    const { model } = this.props;
    const { categoriesPerRow } = model;
    const id = utils.firstAvailableIndex(model.categories.map(a => a.id), 0);
    const data = { id, label: 'Category ' + id };
    const addRowLabel = (model.categories.length) % categoriesPerRow === 0;
    const rowLabels = [...model.rowLabels];

    if (addRowLabel) {
      rowLabels.push('');
    }

    this.props.onModelChanged({
      rowLabels,
      categories: model.categories.concat([data])
    });
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
      rowLabels: newRowLabels
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
      defaultImageMaxWidth
    } = this.props;

    const { categoriesPerRow, rowLabels, errors } = model;
    const { associationError, categoriesError } = errors || {};
    const {
      maxCategories,
      maxImageWidth = {},
      maxImageHeight = {},
    } = configuration || {};
    const holderStyle = {
      gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)`
    };

    const validationMessage = generateValidationMessage(configuration);

    return (
      <div className={classNames(classes.categories, className)}>
        <Header
          label="Categories"
          buttonLabel="ADD A CATEGORY"
          onAdd={this.add}
          info={<Tooltip
            classes={{tooltip: classes.tooltip}}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }}/>
          </Tooltip>}
          buttonDisabled={maxCategories && categories && maxCategories === categories.length}
        />
        {associationError && <div className={classes.errorText}>{associationError}</div>}
        {categoriesError && <div className={classes.errorText}>{categoriesError}</div>}
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
          {categories.map((category, index) => {
            const hasRowLabel = index % categoriesPerRow === 0;
            const rowIndex = index / categoriesPerRow;

            return (
              <React.Fragment
                key={index}
              >
                {hasRowLabel && (
                  <RowLabel
                    categoriesPerRow={categoriesPerRow}
                    rowIndex={rowIndex}
                    markup={rowLabels[rowIndex] || ''}
                    onChange={(val) => this.changeRowLabel(val, rowIndex)}
                    imageSupport={imageSupport}
                    toolbarOpts={toolbarOpts}
                    spellCheck={spellCheck}
                    maxImageWidth={maxImageWidth && maxImageWidth.rowLabel || defaultImageMaxWidth}
                    maxImageHeight={maxImageHeight && maxImageHeight.rowLabel || defaultImageMaxHeight}
                    uploadSoundSupport={uploadSoundSupport}
                  />
                )}
                <Category
                  imageSupport={imageSupport}
                  category={category}
                  onChange={this.change}
                  onDelete={() => this.delete(category)}
                  onAddChoice={this.addChoiceToCategory}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheck}
                  onDeleteChoice={(choice, choiceIndex) =>
                    this.deleteChoiceFromCategory(category, choice, choiceIndex)
                  }
                  maxImageWidth={maxImageWidth && maxImageWidth.categoryLabel || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.categoryLabel || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Categories);
