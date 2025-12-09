import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import Info from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import {
  removeCategory,
  removeChoiceFromCategory,
} from '@pie-lib/categorize';

import Category from './category';
import Header from '../header';
import { generateValidationMessage } from '../../utils';
import { RowLabel } from './RowLabel';
import { renderMath } from '@pie-lib/math-rendering';

const CategoriesContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const CategoriesHolder = styled('div')(({ theme }) => ({
  display: 'grid',
  gridRowGap: `${theme.spacing(1)}px`,
  gridColumnGap: `${theme.spacing(1)}px`,
}));

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(0.5),
}));

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

  deleteChoiceFromCategory = (category, choice, choiceIndex) => {
    const { model, onModelChanged } = this.props;
    const correctResponse = removeChoiceFromCategory(choice.id, category.id, choiceIndex, model.correctResponse);

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
      rowLabels: newRowLabels,
    });
  };

  render() {
    const {
      model,
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
      <CategoriesContainer className={className}>
        <Header
          label="Categories"
          buttonLabel="ADD A CATEGORY"
          onAdd={this.add}
          info={
            <StyledTooltip
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }} />
            </StyledTooltip>
          }
          buttonDisabled={maxCategories && categories && maxCategories === categories.length}
        />

        <CategoriesHolder style={holderStyle}>
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
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheck}
                  onDeleteChoice={(choice, choiceIndex) => this.deleteChoiceFromCategory(category, choice, choiceIndex)}
                  maxImageWidth={(maxImageWidth && maxImageWidth.categoryLabel) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.categoryLabel) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  configuration={configuration}
                  alternateResponseIndex={undefined}
                />
              </React.Fragment>
            );
          })}
        </CategoriesHolder>

        {associationError && <ErrorText>{associationError}</ErrorText>}
        {categoriesError && <ErrorText>{categoriesError}</ErrorText>}
      </CategoriesContainer>
    );
  }
}

export default Categories;
