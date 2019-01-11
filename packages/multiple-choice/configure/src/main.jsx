import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer, ChoiceConfiguration, ConfigLayout } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType, KeyType } from './choice-type';
import Button from '@material-ui/core/Button';

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
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  },
  addButton: {
    float: 'right'
  }
});

const getSideMenuItems = (props) => {
  const {
    classes,
    model,
    configure,
    onChoiceModeChanged,
    onKeyModeChanged,
    onPartialScoringChanged,
    onShuffleChanged
  } = props;
  const {
    responseTypeLabel,
    choicesLabel,
    enableSelectChoiceLabels,
    enableSelectChoiceMode,
    partialScoring,
    shuffle,
    enablePartialScoring,
    enableConfigShuffle
  } = configure;

  return [
    {
      items: [
        enableSelectChoiceMode &&
        <ChoiceType key={0} header={responseTypeLabel} value={model.choiceMode} onChange={onChoiceModeChanged}/>,
        enableSelectChoiceLabels &&
        <KeyType key={1} header={choicesLabel} value={model.keyMode} onChange={onKeyModeChanged}/>
      ]
    },
    {
      items: []
    },
    {
      items: [
        enablePartialScoring && <FormControlLabel
          key={3}
          classes={{
            root: classes.switchElement
          }}
          control={
            <Switch
              checked={partialScoring}
              onChange={onPartialScoringChanged}
              value="checkedA"
            />
          }
          label="Allow Partial Scoring"
          labelPlacement="start"
        />,
        enableConfigShuffle && <FormControlLabel
          key={4}
          classes={{
            root: classes.switchElement
          }}
          control={
            <Switch
              checked={shuffle}
              onChange={onShuffleChanged}
              value="checkedA"
            />
          }
          label="Allow Shuffle Choices"
          labelPlacement="start"
        />
      ]
    }
  ];
};

const Design = withStyles(styles)(props => {
  const {
    classes,
    configure,
    model,
    disableSidePanel,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport
  } = props;
  const {
    promptLabel,
    addChoiceButtonLabel,
    addChoices,
    enableAddFeedBack,
    enableDeleteChoice,
    enableShowPrompt
  } = configure;

  return (
    <div className={classes.design}>
      <ConfigLayout
        sideMenuItems={getSideMenuItems(props)}
        regularItems={
          <div>
            <InputContainer label={promptLabel} className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={onPromptChanged}
                imageSupport={imageSupport}
                nonEmpty={!enableShowPrompt}
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
                allowFeedBack={enableAddFeedBack}
                allowDelete={enableDeleteChoice}
              />
            ))}
            <br />
            {
              addChoices &&
              <Button className={classes.addButton} variant="raised" color="primary" onClick={onAddChoice}>
                {addChoiceButtonLabel}
              </Button>
            }
          </div>
        }
        disableSidePanel={disableSidePanel}
      />
    </div>
  );
});

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onPromptChanged: PropTypes.func.isRequired,
    onPartialScoringChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  render() {
    return (
      <Design {...this.props} />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;

