import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Categories from './categories';
import Choices from './choices';
import { Divider } from './buttons';
import { buildCategories } from './builder';
import debug from 'debug';
import { uid, withDragContext } from '@pie-lib/drag';
import {
  FeedbackConfig
} from '@pie-lib/config-ui';

import {
  removeAllChoices,
  removeCategory,
  moveChoiceToCategory,
  removeChoiceFromCategory,
  countInAnswer,
  ensureNoExtraChoicesInAnswer
} from '@pie-lib/categorize';

import { choiceUtils as utils } from '@pie-lib/config-ui';

const { Provider: IdProvider } = uid;

const log = debug('@pie-element:categorize:configure:design');

export class Design extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uid: PropTypes.string,
    enableFeedback: PropTypes.bool.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {
    enableFeedback: true
  };

  constructor(props) {
    super(props);
    this.uid = props.uid || uid.generateId();
  }

  apply = applyFn => {
    const { model, onChange } = this.props;

    applyFn(model);

    //Ensure that there are no extra choices in correctResponse, if the user has decided that only one choice may be used.
    model.correctResponse = ensureNoExtraChoicesInAnswer(
      model.correctResponse || [],
      model.choices
    );
    //clean categories
    model.categories = model.categories.map(c => ({
      id: c.id,
      label: c.label
    }));

    model.choices = model.choices.map(h => ({
      id: h.id,
      content: h.content,
      categoryCount: h.categoryCount
    }));
    onChange(model);
  };

  changeFeedback = feedback => {
    this.apply(model => (model.feedback = feedback));
  };

  changeCategoryColumns = event => {
    const numberValue = parseInt(event.target.value, 10);

    if (numberValue && numberValue >= 1 && numberValue <= 4) {
      this.apply(model => {
        model.config = model.config || {};
        model.config.categories = model.config.categories || { columns: 2 };
        model.config.categories.columns = numberValue;
      });
    }
  };

  changeCategories = categories => {
    this.apply(model => (model.categories = categories));
  };

  changeChoices = choices => {
    log('[changeChoices]', choices);
    this.apply(model => (model.choices = choices));
  };

  addCategory = () => {
    this.add('categories', id => ({ id, label: 'Category ' + id }));
  };

  addChoice = () => {
    this.add('choices', id => ({ id, content: 'Choice ' + id }));
  };

  add = (name, build) => {
    this.apply(model => {
      log('name: ', name, model, utils);
      const id = utils.firstAvailableIndex(model[name].map(a => a.id), 0);
      const data = build(id);
      model[name] = model[name].concat([data]);
    });
  };

  deleteChoice = choice => {
    log('[deleteChoice] category: ', choice);
    const { model, onChange } = this.props;
    const index = model.choices.findIndex(a => a.id === choice.id);
    if (index !== -1) {
      model.choices.splice(index, 1);
      model.correctResponse = removeAllChoices(
        choice.id,
        model.correctResponse
      );
      onChange(model);
    }
  };

  deleteCategory = category => {
    log('[deleteCategory] category: ', category);
    const { model, onChange } = this.props;
    const index = model.categories.findIndex(a => a.id === category.id);
    if (index !== -1) {
      model.categories.splice(index, 1);
      model.correctResponse = removeCategory(
        category.id,
        model.correctResponse
      );
      log('correctResponse:', model.correctResponse);
      onChange(model);
    }
  };

  addChoiceToCategory = (choice, categoryId) => {
    log('[addChoiceToCategory]', choice, categoryId);

    const { model, onChange } = this.props;
    model.correctResponse = moveChoiceToCategory(
      choice.id,
      undefined,
      categoryId,
      0,
      model.correctResponse
    );

    onChange(model);
  };

  deleteChoiceFromCategory = (category, choice, choiceIndex) => {
    this.apply(model => {
      log(
        '[deleteChoiceFromCategory]: ',
        choice,
        'from',
        category,
        choiceIndex,
        model.correctResponse
      );
      const correctResponse = removeChoiceFromCategory(
        choice.id,
        category.id,
        choiceIndex,
        model.correctResponse
      );
      log('correctResponse: ', correctResponse);
      model.correctResponse = correctResponse;
    });
  };

  countChoiceInCorrectResponse = choice => {
    const { model } = this.props;
    const out = countInAnswer(choice.id, model.correctResponse);
    return out;
  };

  changeChoicesConfig = config => {
    const { model, onChange } = this.props;
    model.config = model.config || {};
    model.config.choices = config;
    onChange(model);
  };

  render() {
    const { classes, className, model, imageSupport } = this.props;

    const config = model.config || {};
    config.categories = config.categories || { columns: 2 };
    config.choices = config.choices || { label: '', columns: 2 };

    const categories = buildCategories(
      model.categories || [],
      model.choices || [],
      model.correctResponse || []
    );

    const choices = model.choices.map(c => {
      c.correctResponseCount = this.countChoiceInCorrectResponse(c);
      return c;
    });

    return (
      <IdProvider value={this.uid}>
        <div className={classNames(classes.design, className)}>
          <Typography className={classes.text}>
            In Categorize, students may drag &amp; drop answer tiles to the
            appropriate category area(s).
          </Typography>
          <Categories
            imageSupport={imageSupport}
            categories={categories}
            columns={config.categories.columns}
            onColumnsChange={this.changeCategoryColumns}
            onChange={this.changeCategories}
            onDeleteChoice={this.deleteChoiceFromCategory}
            onAddChoice={this.addChoiceToCategory}
            onAdd={this.addCategory}
            onDelete={this.deleteCategory}
          />
          <Divider />
          <Choices
            imageSupport={imageSupport}
            choices={choices}
            config={config.choices}
            onConfigChange={this.changeChoicesConfig}
            onChange={this.changeChoices}
            shuffle={model.shuffle}
            onShuffleChange={this.toggleShuffle}
            onAdd={this.addChoice}
            onDelete={this.deleteChoice}
          />
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.changeFeedback}
          />
        </div>
      </IdProvider>
    );
  }
}

const styles = theme => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  design: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

export default withDragContext(withStyles(styles)(Design));
