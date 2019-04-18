import React from 'react';
import { ConfigLayout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import HotspotPalette from './hotspot-palette';
import HotspotContainer from './hotspot-container';

const getSideMenuItems = (props) => {
  const { model, classes, configure, onPartialScoringChanged, onMultipleCorrectChanged } = props;

  const { settingsPartialScoring, settingsMultipleCorrect } = configure;

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
              checked={model.multipleCorrect}
              onChange={onMultipleCorrectChanged}
              value="checkedA"
            />
          }
          label="Multiple Correct Responses"
          labelPlacement="start"
        />,
        settingsPartialScoring && <FormControlLabel
          key={4}
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
          label="Allow Partial Scoring"
          labelPlacement="start"
        />,
      ]
    }
  ];
};

class Design extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      hotspotList: [
        'rgba(137, 183, 244, 0.65)',
        'rgba(217, 30, 24, 0.65)',
        'rgba(254, 241, 96, 0.65)'
      ],
      outlineColor: 'blue',
      outlineList: [
        'blue',
        'red',
        'yellow'
      ],
    }
  }

  handleColorChange(type, color) {
    // const { model, onLayoutChange, onResponseTypeChange } = this.props;
    // const newModel = { ...model };
    //
    // newModel[name] = event.target.value;
    //
    // if (name === 'hotspot') {
    //   onLayoutChange(newModel[name]);
    // } else {
    //   onResponseTypeChange(newModel[name]);
    // }
    this.setState({
      [`${type}Color`]: color
    })
  }

  render() {
    const { props } = this;
    const { classes, disableSidePanel, model, onPromptChanged, onUpdateShapes, onImageUpload } = props;
    const { hotspotColor, outlineColor, hotspotList, outlineList } = this.state;

    return (
      <div className={classes.design}>
        <ConfigLayout
          disableSidePanel={disableSidePanel}
          sideMenuItems={getSideMenuItems(props)}
          regularItems={
            <div className={classes.regular}>
              <InputContainer label="Item Stem" className={classes.promptContainer}>
                <EditableHtml markup={model.prompt} onChange={onPromptChanged}/>
              </InputContainer>

              <Typography className={classes.subheader} variant="subheading">
                Define Hotspot
              </Typography>

              <HotspotPalette
                hotspotColor={hotspotColor}
                hotspotList={hotspotList}
                outlineColor={outlineColor}
                outlineList={outlineList}
                onHotspotColorChange={color => this.handleColorChange('hotspot', color)}
                onOutlineColorChange={color => this.handleColorChange('outline', color)}
              />

              <HotspotContainer
                imageUrl={model.imageUrl}
                multipleCorrect={model.multipleCorrect}
                hotspotColor={hotspotColor}
                outlineColor={outlineColor}
                onUpdateShapes={onUpdateShapes}
                onImageUpload={onImageUpload}
                shapes={model.shapes}
              />
            </div>
          }
        />
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    marginTop: theme.spacing.unit
  },
  design: {
    marginTop: theme.spacing.unit * 3
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  regular: {
    marginBottom: theme.spacing.unit * 3
  },
  subheader: {
    marginTop: theme.spacing.unit * 4
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  }
});

const StyledDesign = withStyles(styles)(Design);

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
      <StyledDesign {...this.props} />
    );
  }
}

const MainStyled = withStyles(styles)(Main);

export default MainStyled;

