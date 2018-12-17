import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer, ChoiceConfiguration, Layout } from '@pie-lib/config-ui';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType, KeyType } from './choice-type';
import Button from '@material-ui/core/Button';
import debug from 'debug';

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
    onChoiceModeChanged,
    onKeyModeChanged,
    onPartialScoringChanged,
    onShuffleChanged
  } = props;
  const { configure: {
    responseTypeLabel,
    choicesLabel,
    enableSelectResponseType,
    enableSelectChoiceMode,
    partialScoring,
    shuffle,
    enablePartialScoring,
    enableConfigShuffle
  } } = model;

  return [
    {
      items: [
        enableSelectResponseType &&
        <ChoiceType key={0} header={responseTypeLabel} value={model.choiceMode} onChange={onChoiceModeChanged}/>,
        enableSelectChoiceMode &&
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
    model,
    disableSidePanel,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport
  } = props;
  const { configure: {
    promptLabel,
    addChoiceButtonLabel,
    enableAddChoice,
    enableAddFeedBack,
    enableDeleteChoice,
    enableSelectChoiceLabels,
    enableShowPrompt
  } } = model;

  return (
    <div className={classes.design}>
      <Layout
        sideMenuItems={getSideMenuItems(props)}
        regularItems={
          <div>
            <InputContainer label={promptLabel} className={classes.promptHolder}>
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
                allowFeedBack={enableAddFeedBack}
                allowDelete={enableDeleteChoice}
                disabled={!enableSelectChoiceLabels}
                nonEmpty={!enableShowPrompt}
              />
            ))}
            <br />
            {
              enableAddChoice &&
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

const Basics = props => {
  log('[Basics] props', props);
  const { classes, model, onChoiceModeChanged, onKeyModeChanged } = props;
  const { configure: {
    responseTypeLabel,
    choicesLabel,
    enableSelectResponseType,
    enableSelectChoiceMode
  } } = model;

  return (
    <div className={classes.baseTypes}>
      {
        enableSelectResponseType &&
        <ChoiceType header={responseTypeLabel} value={model.choiceMode} onChange={onChoiceModeChanged} />
      }
      {
        enableSelectChoiceMode &&
        <KeyType header={choicesLabel} value={model.keyMode} onChange={onKeyModeChanged} />
      }
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

const theme = createMuiTheme({
  palette: {
    action: {
      disabled: 'rgba(0, 0, 0, 0.54);'
    }
  },
  overrides: {
    MuiRadio: {
      checked: {
        color: '#3f51b5 !important'
      }
    },
    MuiCheckbox: {
      checked: {
        color: '#3f51b5 !important'
      }
    },
    MuiTabs: {
      root: {
        borderBottom: '1px solid #eee'
      }
    },
    MuiSwitch: {
      checked: {
        color: '#3f51b5 !important',
        '& + $bar': {
          backgroundColor: '#3f51b5 !important',
          opacity: 0.5
        }
      }
    }
  }
});

const RootElem = props => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default RootElem;

