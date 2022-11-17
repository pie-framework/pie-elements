import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Choice, { ChoiceType } from './choice';
import PlaceHolder from './droppable-placeholder';
export { ChoiceType };

const Blank = () => <div />;

export class Choices extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape(ChoiceType),
        PropTypes.shape({ empty: PropTypes.bool }),
      ])
    ),
    model: PropTypes.shape({
      categoriesPerRow: PropTypes.number,
      choicesLabel: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    choicePosition: PropTypes.string,
  };

  static defaultProps = {
    model: {
      categoriesPerRow: 1,
      choicesLabel: '',
    },
  };

  render() {
    const {
      classes,
      choices = [],
      model,
      disabled,
      onDropChoice,
      choicePosition,
    } = this.props;

    let style = {
      textAlign: 'center',
    };

    if (choicePosition === 'left') {
      style.direction = 'rtl';
    }

    return (
      <div className={classes.wrapper}>
         <PlaceHolder
          onDropChoice={onDropChoice}
          disabled={disabled}
          style={{background: 'none', }}
          choiceBoard={true}
          >
        {model.choicesLabel && model.choicesLabel !== '' && (
          <div className={classes.labelHolder} dangerouslySetInnerHTML={{__html: model.choicesLabel}}></div>
        )}
          {choices.map((c, index) => {
            return c.empty ? (
              <Blank key={index} />
            ) : (
              <Choice
                disabled={disabled}
                className={classes.choice}
                key={index}
                extraStyle={{ maxWidth: `${95 / model.categoriesPerRow}%` }}
                {...c}
              />
            );
          })}
        </PlaceHolder>
      </div>
    );
  }
}

const styles = (theme) => ({
  wrapper: {
    flex: 1,
    padding: theme.spacing.unit,
    touchAction: 'none',
  },
  choices: {
    padding: theme.spacing.unit / 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelHolder: {
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
});

export default withStyles(styles)(Choices);
