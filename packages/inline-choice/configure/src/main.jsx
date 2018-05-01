import React from 'react';
import { ChoiceConfiguration } from '@pie-lib/config-ui';

import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import debug from 'debug';
import PropTypes from 'prop-types';

const log = debug('@pie-element:inline-choice-configure');

const Choice = withStyles(theme => ({
  choice: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2
  }
}))(({ choice, onChange, onDelete, classes }) => (
  <ChoiceConfiguration
    className={classes.choice}
    index={undefined}
    mode={'radio'}
    data={choice}
    defaultFeedback={{
      correct: 'Correct',
      incorrect: 'Incorrect'
    }}
    onChange={onChange}
    onDelete={onDelete}
  />
));

export class RawMain extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onChoiceChange: PropTypes.func.isRequired,
    onRemoveChoice: PropTypes.func.isRequired,
    onAddChoice: PropTypes.func.isRequired,
    onPromptChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      activeLang: props.model.defaultLang
    };
  }

  onChoiceChange = (index, choice) => {
    this.props.onChoiceChange(index, choice);
  };

  render() {
    const { model, onRemoveChoice, onAddChoice } = this.props;

    log('choices', model.choices);

    return (
      <div>
        {model.choices.map((choice, index) => (
          <Choice
            choice={choice}
            onChange={choice => this.onChoiceChange(index, choice)}
            onDelete={() => onRemoveChoice(index)}
            key={index}
          />
        ))}
        <Button color="primary" onClick={onAddChoice}>
          Add a choice
        </Button>
      </div>
    );
  }
}
export default withStyles(theme => ({
  prompt: {
    paddingBottom: theme.spacing.unit * 4
  }
}))(RawMain);
