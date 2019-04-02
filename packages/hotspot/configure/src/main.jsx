import React from 'react';
import PropTypes from 'prop-types';
import { ConfigLayout } from '@pie-lib/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Hotspot from './hotspot';

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
  const { classes, configure, onPartialScoringChanged, onMultipleCorrectChanged } = props;

  const { partialScoring, settingsPartialScoring, multipleCorrect, settingsMultipleCorrect } = configure;

  return [
    {
      items: [
        settingsMultipleCorrect && <FormControlLabel
          key={3}
          classes={{
            root: classes.switchElement
          }}
          control={
            <Switch
              checked={multipleCorrect}
              onChange={onMultipleCorrectChanged}
              value="checkedA"
            />
          }
          label="Multiple Correct Responses"
          labelPlacement="start"
        />,
        settingsPartialScoring && <FormControlLabel
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
      ]
    }
  ];
};

const Design = withStyles(styles)(props => {
  const {
    classes,
    disableSidePanel,
  } = props;

  return (
    <div className={classes.design}>
      <ConfigLayout
        sideMenuItems={getSideMenuItems(props)}
        regularItems={
          <div>
            <Hotspot />
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

