import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer, ChoiceConfiguration, ConfigLayout } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  part: {
    background: '#F8F8F8',
    border: '0.75px solid #B4B4B4',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  partHeader: {
    borderBottom: '0.75px solid #B4B4B4',
    padding: '12px 13px',
  },
  partBody: {
    padding: '38px 28px'
  },
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

export class Configure extends React.Component {
  getSideMenuItems(props) {
    return [
      {
        items: [
          <div>Side menu 1</div>,
          <div>Side menu 2</div>,
        ]
      },
      {
        items: []
      },
    ];
  }

  getRegularItems(props) {
    const { classes, keyMode, model: { partA: { prompt, choices, choiceMode } }, onPromptChanged, onAddChoice, addChoiceButtonLabel } = props;
    return (
      <div className={classes.part}>
        <div className={classes.partHeader}>
          Multiple Choice
        </div>
        <div className={classes.partBody}>
          <InputContainer label={prompt} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={prompt}
              onChange={onPromptChanged}
              disableUnderline
            />
          </InputContainer>
          {choices.map((choice, index) => (
            <ChoiceConfiguration
              key={index}
              index={index + 1}
              useLetterOrdering={keyMode === 'letters'}
              className={classes.choiceConfiguration}
              mode={choiceMode}
              data={choice}
              allowFeedBack={false}
              onDelete={c => console.log('Delete.')}
              onChange={c => console.log('Change.')}
            />
          ))}
          <br />
          <Button className={classes.addButton} variant="contained" color="primary" onClick={() => onAddChoice('partA')}>
            {addChoiceButtonLabel}
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const {
      classes,
      model,
      disableSidePanel,
    } = this.props;

    console.log('======== classes: ', classes);
    console.log('======== model: ', model);

    return (
      <div className={classes.design}>
        <ConfigLayout
          sideMenuItems={this.getSideMenuItems(this.props)}
          regularItems={this.getRegularItems(this.props)}
          disableSidePanel={disableSidePanel}
        />
      </div>
    );
  }
}

const ConfigureMain = withStyles(styles)(Configure);

export class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func,
    disableSidePanel: PropTypes.bool,
    onPromptChanged: PropTypes.func.isRequired,
    // onPartialScoringChanged: PropTypes.func.isRequired,
    // classes: PropTypes.object.isRequired,
    // imageSupport: PropTypes.shape({
    //   add: PropTypes.func.isRequired,
    //   delete: PropTypes.func.isRequired
    // })
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    this.onModelChanged = m => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    };
  }

  render() {
    // return this.innerHTML = `<pre>${JSON.stringify(this.props.model, null, '  ')}</pre>`;
    return (
      <ConfigureMain {...this.props} />
    );
  }
}

export default StateWrapper;

