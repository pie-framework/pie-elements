import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { renderMath } from '@pie-lib/math-rendering';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Choice from './choice';
import { withStyles } from '@material-ui/core/styles';

window.renMath = renderMath;

const styles = theme => ({
  design: {
    marginTop: theme.spacing.unit * 2
  },
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

const prepareVal = html => {
  const tmp = document.createElement('DIV');

  tmp.innerHTML = html;

  const value = tmp.textContent || tmp.innerText || '';

  return value.trim();
};

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

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);

    if (this.focusedNodeRef) {
      this.focusedNodeRef.focus('end');
    }
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
      const hiddenChoices = {};

      choices.forEach(c => {
        if (!newDuplicates && find(correctResponse, v => v === c.id)) {
          hiddenChoices[c.id] = true;
        }
      });

      this.setState({
        hiddenChoices,
        choices: newChoices
      });
    }
  };

  onChoiceChanged = (prevValue, val, key) => {
    const { choices } = this.state;
    const { onChange, model } = this.props;
    const { choices: oldChoices } = model;

    const newChoices = oldChoices.reduce((arr, c) => {
      const foundC = choices.find(ch => ch.id === c.id);
      let nextC = c;

      if (c.id === key) {
        nextC = {
          ...c,
          value: val
        };
      } else if (foundC) {
        nextC = foundC;
      }

      if (nextC && nextC.value) {
        arr.push(nextC);
      }

      return arr;
    }, []);

    if (!prevValue && prepareVal(val)) {
      newChoices.push({
        id: key,
        value: val
      });
    }

    onChange(newChoices);
  };

  onChoiceFocus = id => this.setState({
    focusedEl: id
  });

  onAddChoice = () => {
    const { model: { choices: oldChoices } } = this.props;
    const { choices } = this.state;

    if (!choices.length || (choices.length && choices[choices.length - 1].value !== '')) {
      this.setState({
        choices: [
          ...choices,
          {
            id: `${oldChoices.length}`,
            value: ''
          }
        ]
      });
    }
  };

  handleChoiceDropped = id => {
    const { duplicates } = this.props;
    const { choices } = this.state;

    if (!duplicates) {
      this.setState({
        choices: choices.filter(c => c.id !== id)
      });
    }
  };

  handleChoiceRemove = id => {
    const { onChange } = this.props;
    const { choices } = this.state;
    const newChoices = choices.filter(c => c.id !== id);

    onChange(newChoices);
  };

  render() {
    const { choices, focusedEl, hiddenChoices } = this.state;
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
        <div
          className={classes.altChoices}
        >
          {
            choices &&
            choices.map((c, index) => {
              if (hiddenChoices[c.id]) {
                return null;
              }

              if (focusedEl === c.id) {
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '100%',
                      zIndex: '100'
                    }}
                  >
                    <EditableHtml
                      ref={ref => (this.focusedNodeRef = ref)}
                      className={classes.prompt}
                      markup={c.value}
                      onChange={val => this.onChoiceChanged(c.value, val, c.id)}
                      onDone={() => {
                        this.setState({
                          focusedEl: undefined
                        });
                      }}
                      disableUnderline
                    />
                  </div>
                );
              }

              return (
                <Choice
                  key={index}
                  duplicates={duplicates}
                  targetId="0"
                  choice={c}
                  onClick={() => this.onChoiceFocus(c.id)}
                  onChoiceDropped={() => this.handleChoiceDropped(c.id)}
                  onRemoveChoice={() => this.handleChoiceRemove(c.id)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

const Styled = withStyles(styles)(Choices);

export default Styled;