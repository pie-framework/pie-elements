import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from '../buttons';
import classNames from 'classnames';
import Choice from './choice';
import Header from '../header';
import every from 'lodash/every';
import Config from './config';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import { removeAllChoices } from '@pie-lib/categorize';

export class Choices extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choices: PropTypes.array.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    toolbarOpts: PropTypes.object
  };

  static defaultProps = {};

  changeChoice = choice => {
    const { choices, onModelChanged } = this.props;
    const index = choices.findIndex(h => h.id === choice.id);
    if (index !== -1) {
      choices.splice(index, 1, choice);
      onModelChanged({ choices });
    }
  };

  allChoicesHaveCount = count => {
    const { choices } = this.props;
    return every(choices, c => c.categoryCount === count);
  };

  addChoice = () => {
    const { onModelChanged, model } = this.props;

    const id = utils.firstAvailableIndex(model.choices.map(a => a.id), 0);
    const data = { id, content: 'Choice ' + id };

    onModelChanged({ choices: model.choices.concat([data]) });
  };

  deleteChoice = choice => {
    const { model, onModelChanged } = this.props;
    const index = model.choices.findIndex(a => a.id === choice.id);
    if (index !== -1) {
      model.choices.splice(index, 1);
      model.correctResponse = removeAllChoices(
        choice.id,
        model.correctResponse
      );
      onModelChanged(model);
    }
  };

  render() {
    const {
      classes,
      className,
      choices,
      model,
      imageSupport,
      onModelChanged,
      toolbarOpts
    } = this.props;

    const categoryCountIsOne = this.allChoicesHaveCount(1);
    const choiceHolderStyle = {
      gridTemplateColumns: `repeat(${model.categoriesPerRow}, 1fr)`
    };

    return (
      <div className={classNames(classes.choices, className)}>
        <Header label="Choices" buttonLabel="ADD A CHOICE" onAdd={this.addChoice} />
        <Config
          config={model}
          categoryCountIsOne={categoryCountIsOne}
          onModelChanged={onModelChanged}
          allChoicesHaveCount={this.allChoicesHaveCount}
        />
        <div className={classes.choiceHolder} style={choiceHolderStyle}>
          {choices.map((h, index) => (
            <Choice
              choice={h}
              correctResponseCount={h.correctResponseCount}
              key={index}
              imageSupport={imageSupport}
              onChange={this.changeChoice}
              onDelete={() => this.deleteChoice(h)}
              toolbarOpts={toolbarOpts}
            />
          ))}
        </div>
        <Divider />
      </div>
    );
  }
}
const styles = theme => ({
  choiceHolder: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`
  },
  choices: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  label: {}
});
export default withStyles(styles)(Choices);
