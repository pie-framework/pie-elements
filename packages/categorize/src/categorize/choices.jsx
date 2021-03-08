import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Choice, { ChoiceType } from './choice';
export { ChoiceType };
import GridContent from './grid-content';

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
      choicesPerRow: PropTypes.number,
      choicesLabel: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    choicePosition: PropTypes.string,
  };

  static defaultProps = {
    model: {
      choicesPerRow: 4,
      choicesLabel: '',
    },
  };

  render() {
    const {
      classes,
      choices = [],
      model,
      disabled,
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
        {model.choicesLabel && model.choicesLabel !== '' && (
          <div className={classes.labelHolder}>{model.choicesLabel}</div>
        )}
        <GridContent
          columns={model.choicesPerRow}
          className={classes.choices}
          extraStyle={style}
        >
          {choices.map((c, index) => {
            return c.empty ? (
              <Blank key={index} />
            ) : (
              <Choice
                disabled={disabled}
                className={classes.choice}
                key={index}
                {...c}
              />
            );
          })}
        </GridContent>
      </div>
    );
  }
}

const styles = (theme) => ({
  wrapper: {
    flex: 1,
    padding: theme.spacing.unit,
  },
  choices: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  labelHolder: {
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
  },
});

export default withStyles(styles)(Choices);
