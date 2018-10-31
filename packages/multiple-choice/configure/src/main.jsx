import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer, ChoiceConfiguration } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { ChoiceType, KeyType } from './choice-type';
import Button from '@material-ui/core/Button';
import debug from 'debug';
import PartialScoringConfig from '@pie-lib/scoring-config';

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

const Design = withStyles(styles)(props => {
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
      <InputContainer label="Prompt" className={classes.promptHolder}>
        <EditableHtml
          className={classes.prompt}
          markup={model.prompt}
          onChange={onPromptChanged}
          imageSupport={imageSupport}
        />
      </InputContainer>
      {model.choices.map((choice, index) => (
        <ChoiceConfiguration
          key={index}
          noLabels
          index={index + 1}
          useLetterOrdering={model.keyMode === 'letters'}
          className={classes.choiceConfiguration}
          mode={model.choiceMode}
          data={choice}
          defaultFeedback={{}}
          imageSupport={imageSupport}
          onDelete={() => onRemoveChoice(index)}
          onChange={c => onChoiceChanged(index, c)}
        />
      ))}
      <br />
      <Button variant="raised" color="primary" onClick={() => onAddChoice()}>
        Add a choice
      </Button>
    </div>
  );
});

const Basics = props => {
  log('[Basics] props', props);

  const { classes, model, onChoiceModeChanged, onKeyModeChanged } = props;
  return (
    <div className={classes.baseTypes}>
      <ChoiceType value={model.choiceMode} onChange={onChoiceModeChanged} />
      <KeyType value={model.keyMode} onChange={onKeyModeChanged} />
    </div>
  );
};

Basics.propTypes = {
  classes: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  onChoiceModeChanged: PropTypes.func.isRequired,
  onKeyModeChanged: PropTypes.func.isRequired
};

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onPromptChanged: PropTypes.func.isRequired,
    onPartialScoringChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  onTabsChange = (event, index) => {
    this.setState({ index });
  };

  render() {
    const { model, onPartialScoringChanged } = this.props;
    const { index } = this.state;

    return (
      <div>
        <Tabs onChange={this.onTabsChange} value={index}>
          <Tab label="Design" />
          <Tab label="Scoring" />
        </Tabs>
        {index === 0 && <Design {...this.props} />}
        {index === 1 && (
          <PartialScoringConfig
            partialScoring={model.partialScoring}
            label={model.partialScoringLabel}
            onChange={onPartialScoringChanged}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Main);
