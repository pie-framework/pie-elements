import React from 'react';
import { ChoiceConfiguration } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import debug from 'debug';

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
    onDelete={onDelete} />
));

export class RawMain extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeLang: props.model.defaultLang
    }
  }

  onChoiceChange = (index, choice) => {
    this.props.onChoiceChange(index, choice);
  }

  onPromptChange = (value) => {
    this.props.onPromptChange(value);
  }

  render() {
    const { model, classes, onRemoveChoice, onAddChoice } = this.props;

    log('choices', model.choices);

    return (
      <div>
        {model.prompt && (
          <EditableHtml
            label="Prompt"
            markup={model.prompt}
            lang={'en-US'}
            onChange={this.onPromptChange}
            className={classes.prompt} />
        )}
        {model.choices.map((choice, index) => (
          <Choice
            choice={choice}
            onChange={(choice) => this.onChoiceChange(index, choice)}
            onDelete={() => onRemoveChoice(index)}
            key={index} />
        ))}
        <Button
          color="primary"
          onClick={onAddChoice}>Add a choice</Button>
      </div>
    );
  }
}
export default withStyles(theme => ({
  prompt: {
    paddingBottom: theme.spacing.unit * 4
  }
}))(RawMain);