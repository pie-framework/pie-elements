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
    onChoicePrefixChanged,
    classes,
    model,
    configure,
    onChoiceModeChanged,
    onPartialScoringChanged,
    onLockChoiceOrderChanged
  } = props;
  const {
    choiceMode,
    choicePrefix,
    partialScoring,
    lockChoiceOrder
  } = configure;

  return [
    {
      items: [
        choiceMode.settings &&
        <ChoiceType key={0} header={choiceMode.label} value={model.choiceMode} onChange={onChoiceModeChanged}/>,
        choicePrefix.settings &&
        <KeyType key={1} header={choicePrefix.label} value={model.choicePrefix} onChange={onChoicePrefixChanged}/>
      ]
    },
    {
      items: []
    },
    {
      items: [
        partialScoring.settings && <FormControlLabel
          key={3}
          classes={{
            root: classes.switchElement
          }}
          control={
            <Switch
              checked={model.partialScoring}
              onChange={onPartialScoringChanged}
              value="checkedA"
            />
          }
          label={partialScoring.label}
          labelPlacement="start"
        />,
        lockChoiceOrder.settings && <FormControlLabel
          key={4}
          classes={{
            root: classes.switchElement
          }}
          control={
            <Switch
              checked={model.lockChoiceOrder}
              onChange={onLockChoiceOrderChanged}
              value="checkedA"
            />
          }
          label={lockChoiceOrder.label}
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
    itemStem,
    addChoiceButton,
    feedback,
    deleteChoice,
  } = configure;

  return (
    <div className={classes.design}>
      <ConfigLayout
        sideMenuItems={getSideMenuItems(props)}
        regularItems={
          <div>
            {itemStem.settings &&
              <InputContainer
                label={itemStem.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.itemStem}
                  onChange={onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={!itemStem.settings}
                  disableUnderline
                />
              </InputContainer>
            }
            {model.choices.map((choice, index) => (
              <ChoiceConfiguration
                key={index}
                index={index + 1}
                useLetterOrdering={model.choicePrefix === 'letters'}
                className={classes.choiceConfiguration}
                mode={model.choiceMode}
                data={choice}
                defaultFeedback={{}}
                imageSupport={imageSupport}
                onDelete={() => onRemoveChoice(index)}
                onChange={c => onChoiceChanged(index, c)}
                allowFeedBack={feedback.settings}
                allowDelete={deleteChoice.settings}
              />
            ))}
            <br />
            {
              addChoiceButton.settings &&
              <Button className={classes.addButton} variant="contained" color="primary" onClick={onAddChoice}>
                {addChoiceButton.label}
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

