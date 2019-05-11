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
  const {
    model,
    classes,
    configure,
    onPartialScoringChanged,
    onMultipleCorrectChanged,
    onConfigurationChanged
  } = props;
  const { settingsPartialScoring, settingsMultipleCorrect, rationale } = configure;

  const partialScoringDisabled = !model.multipleCorrect;
  const partialScoringChecked = partialScoringDisabled ? false : model.partialScoring;

  return [
    {
      items: [
        settingsMultipleCorrect && <FormControlLabel
          key={3}
          classes={{ root: classes.switchElement }}
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
          classes={{ root: classes.switchElement }}
          control={
            <Switch
              disabled={partialScoringDisabled}
              checked={partialScoringChecked}
              onChange={onPartialScoringChanged}
              value="checkedA"
            />
          }
          label="Allow Partial Scoring"
          labelPlacement="start"
        />,
        rationale.settings && <FormControlLabel
          key={5}
          classes={{ root: classes.switchElement }}
          control={
            <Switch
              checked={rationale.enabled}
              onChange={() => onConfigurationChanged('rationale', {
                ...rationale,
                enabled: !rationale.enabled
              })}
              value="checkedA"
            />
          }
          label={rationale.label}
          labelPlacement="start"
        />
      ]
    }
  ];
};

class Root extends React.Component {
  handleColorChange(type, color) {
    const { onColorChanged } = this.props;
    const cType = `${type}Color`;
    onColorChanged(cType, color);
  }

  render() {
    const {
      classes,
      disableSidePanel,
      model,
      onImageUpload,
      onPromptChanged,
      onRationaleChanged,
      onUpdateImageDimension,
      onUpdateShapes,
      configure,
      imageSupport
    } = this.props;
    const { rationale = {} } = configure;

    return (
      <div className={classes.base}>
        <ConfigLayout
          disableSidePanel={disableSidePanel}
          sideMenuItems={getSideMenuItems(this.props)}
          regularItems={
            <div className={classes.regular}>
              <InputContainer label="Item Stem" className={classes.prompt}>
                <EditableHtml markup={model.prompt} onChange={onPromptChanged}/>
              </InputContainer>

              {rationale.enabled && (
                <InputContainer label={rationale.label} className={classes.prompt}>
                  <EditableHtml markup={model.rationale || ''} onChange={onRationaleChanged} imageSupport={imageSupport}/>
                </InputContainer>
              )}

              <Typography className={classes.label} variant="subheading">
                Define Hotspot
              </Typography>

              <HotspotPalette
                hotspotColor={model.hotspotColor}
                hotspotList={model.hotspotList}
                outlineColor={model.outlineColor}
                outlineList={model.outlineList}
                onHotspotColorChange={color => this.handleColorChange('hotspot', color)}
                onOutlineColorChange={color => this.handleColorChange('outline', color)}
              />

              <HotspotContainer
                dimensions={model.dimensions}
                imageUrl={model.imageUrl}
                multipleCorrect={model.multipleCorrect}
                hotspotColor={model.hotspotColor}
                outlineColor={model.outlineColor}
                onUpdateImageDimension={onUpdateImageDimension}
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
  base: {
    marginTop: theme.spacing.unit * 3
  },
  container: {
    display: 'flex',
    marginTop: theme.spacing.unit
  },
  label: {
    marginTop: theme.spacing.unit * 4
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  regular: {
    marginBottom: theme.spacing.unit * 3
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0
  }
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  configure: PropTypes.object,
  disableSidePanel: PropTypes.bool,
  model: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func
  }),
  onImageUpload: PropTypes.func.isRequired,
  onColorChanged: PropTypes.func.isRequired,
  onPartialScoringChanged: PropTypes.func.isRequired,
  onPromptChanged: PropTypes.func.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  onRationaleChanged: PropTypes.func.isRequired,
  onConfigurationChanged: PropTypes.func.isRequired,
};

export default withStyles(styles)(Root);
