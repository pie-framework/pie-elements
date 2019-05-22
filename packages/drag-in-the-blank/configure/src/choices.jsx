import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import Button from '@material-ui/core/Button';
import Choice from './choice';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  altChoices: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: '20px 0 0 0',
    '& > *': {
      marginBottom: '20px'
    }
  }
});

const Overlay = withStyles({
  root: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    top: '0',
    zIndex: '99'
  }
})(({ classes, ...rest }) => (
  <div
    className={classes.root}
    {...rest}
  />
));

export class Choices extends React.Component {
  static propTypes = {
    duplicates: PropTypes.bool,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateChoicesIfNeeded(nextProps);
  }

  componentDidMount() {
    this.updateChoicesIfNeeded(this.props);
  }

  updateChoicesIfNeeded = props => {
    const { choices } = this.state;
    const {
      model: {
        choices: newChoices,
        correctResponse: newCorrect
      },
      duplicates: newDuplicates
    } = props;
    const {
      model: {
        choices: oldChoices,
        correctResponse: oldCorrect
      },
      duplicates: oldDuplicates
    } = this.props;

    if (
      !choices ||
      !isEqual(newChoices, oldChoices) ||
      !isEqual(newDuplicates, oldDuplicates) ||
      !isEqual(newCorrect, oldCorrect)
    ) {
      const { choices, correctResponse } = props.model;
      const newChoices = choices.reduce((arr, c) => {
        if (newDuplicates) {
          arr.push(c);
        } else if (!find(correctResponse, v => v === c.id)) {
          arr.push(c);
        }

        return arr;
      }, []);

      this.setState({
        choices: newChoices
      });
    }
  };

  onChoiceChanged = (val, key) => {
    const { onChange } = this.props;
    const { choices } = this.state;
    const newChoices = choices.map(c => c.id === key
      ? {
        ...c,
        value: val
      }
      : c
    );

    onChange(newChoices);
  };

  onChoiceFocus = id => this.setState({
    focusedEl: id
  });

  handleChoiceDropped = id => {
    const { choices } = this.state;

    this.setState({
      choices: choices.filter(c => c.id !== id)
    });
  };

  render() {
    const { choices, focusedEl } = this.state;
    const {
      classes,
      duplicates
    } = this.props;

    return (
      <div className={classes.design}>
        <Button
          className={classes.addButton}
          variant="contained"
          color="primary"
          onClick={this.onAddChoice}
        >
          Add Choice
        </Button>
        {
          focusedEl &&
          <Overlay
            onMouseDown={() => this.setState({
              focusedEl: undefined
            })}
          />
        }
        <div
          className={classes.altChoices}
        >
          {
            choices &&
            choices.map((c, index) => focusedEl === c.id
              ? (
                <div
                  key={index}
                  style={{
                    minWidth: '100%',
                    zIndex: '100'
                  }}
                >
                  <EditableHtml
                    className={classes.prompt}
                    markup={c.value}
                    onChange={val => this.onChoiceChanged(val, c.id)}
                    disableUnderline
                  />
                </div>
              )
              : (
              <Choice
                key={index}
                duplicates={duplicates}
                targetId="0"
                choice={c}
                onClick={() => this.onChoiceFocus(c.id)}
                onChoiceDropped={() => this.handleChoiceDropped(c.id)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Choices);

export default Styled;