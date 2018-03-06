import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-libs/editable-html';
import { InputContainer, ChoiceConfiguration } from '@pie-libs/config-ui';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import { ChoiceType, KeyType } from './choice-type'
import Button from 'material-ui/Button';
import debug from 'debug';
import PartialScoringConfig from '@pie-libs/scoring-config';

const log = debug('@pie-element:multiple-choice:main');

const styles = theme => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  design: {
    paddingTop: theme.spacing.unit * 3
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const Design = withStyles(styles)((props) => {
  const {
    classes,
    model,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport
  } = props;

  return (
    <div className={classes.design}>
      <Basics {...props} />
      <InputContainer label="Prompt" className={classes.promptHolder} >
        <EditableHtml
          className={classes.prompt}
          markup={model.prompt}
          onChange={onPromptChanged} />
      </InputContainer>
      {model.choices.map((choice, index) => <ChoiceConfiguration
        index={index + 1}
        className={classes.choiceConfiguration}
        mode={model.choiceMode}
        key={index}
        data={choice}
        defaultFeedback={{}}
        imageSupport={imageSupport}
        onDelete={() => onRemoveChoice(index)}
        onChange={c => onChoiceChanged(index, c)} />)}
      <br />
      <Button
        variant="raised"
        color="primary"
        onClick={() => onAddChoice()} >Add a choice</Button>
    </div>
  );

});


const Basics = (props) => {

  log('[Basics] props', props);

  const { classes, model, onChoiceModeChanged, onKeyModeChanged } = props;
  return (
    <div className={classes.baseTypes}>
      <ChoiceType value={model.choiceMode} onChange={onChoiceModeChanged} />
      <KeyType value={model.keyMode} onChange={onKeyModeChanged} />
    </div>
  );
}

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }

  onTabsChange = (event, index) => {
    this.setState({ index });
  }

  render() {

    const {
      model,
      onPromptChanged,
      onPartialScoringChanged,
      classes } = this.props;
    const { index } = this.state;

    return (
      <div>
        <Tabs onChange={this.onTabsChange} value={index}>
          <Tab label="Design"></Tab>
          <Tab label="Scoring"></Tab>
        </Tabs>
        {index === 0 && <Design {...this.props} />}
        {index === 1 && <PartialScoringConfig
          partialScoring={model.partialScoring}
          numberOfCorrectResponses={model.choices.filter(choice => choice.correct).length}
          onChange={onPartialScoringChanged} />}
      </div>

    );
  }
}

Main.propTypes = {
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired
  })
}


export default withStyles(styles)(Main);