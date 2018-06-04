import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Choice from './choice';
import Header from '../header';
import every from 'lodash/every';
import Config from './config';

export class Choices extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    onConfigChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  static defaultProps = {};

  toggleRemoveAllTiles = () => {
    const { choices, onChange } = this.props;

    const allAtOne = this.allChoicesHaveCount(1);
    const update = choices.map(c => {
      c.categoryCount = allAtOne ? 0 : 1;
      return c;
    });
    onChange(update);
  };

  changeChoice = choice => {
    const { choices, onChange } = this.props;
    const index = choices.findIndex(h => h.id === choice.id);
    if (index !== -1) {
      choices.splice(index, 1, choice);
      onChange(choices);
    }
  };

  allChoicesHaveCount = count => {
    const { choices } = this.props;
    return every(choices, c => c.categoryCount === count);
  };

  render() {
    const {
      classes,
      className,
      choices,
      onAdd,
      onDelete,
      config,
      onConfigChange
    } = this.props;

    const categoryCountIsOne = this.allChoicesHaveCount(1);

    const choiceHolderStyle = {
      gridTemplateColumns: `repeat(${config.columns}, 1fr)`
    };
    return (
      <div className={classNames(classes.choices, className)}>
        <Header label="Choices" onAdd={onAdd} />

        <div className={classes.choiceHolder} style={choiceHolderStyle}>
          {choices.map((h, index) => (
            <Choice
              choice={h}
              correctResponseCount={h.correctResponseCount}
              key={index}
              onChange={this.changeChoice}
              onDelete={() => onDelete(h)}
            />
          ))}
        </div>
        <Config
          config={config}
          onChange={onConfigChange}
          categoryCountIsOne={categoryCountIsOne}
          onToggleCategoryCount={this.toggleRemoveAllTiles}
        />
      </div>
    );
  }
}
const styles = theme => ({
  row: {
    display: 'grid',
    gridColumnGap: `${theme.spacing.unit}px`,
    gridRowGap: `${theme.spacing.unit}px`,
    gridTemplateColumns: 'repeat(3, 1fr)',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
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
