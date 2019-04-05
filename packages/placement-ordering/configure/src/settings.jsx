import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType } from './choice-type';

const updateConfigureProp = (model, configProperty) => ({
  ...model,
  configure: {
    ...model.configure,
    [configProperty]: !model.configure[configProperty]
  }
});

const updateModelProp = (model, property) => ({
  ...model,
  [property]: !model[property]
});

const getSideMenuItems = (props) => {
  const { model, updateModel } = props;
  const {
    configure: {
      settingsChoiceLabel,
      settingsShuffle,
      settingsPlacementArea,
      settingsNumberedGuides,
      settingsEnableImages,
      settingsRemoveTileAfterPlacing,
      settingsOrientation,
      settingsPartialScoring,

      choiceLabel,
      shuffleLabel,
      placementAreaLabel,
      numberedGuidesLabel,
      enableImagesLabel,
      removeTilesLabel,
      orientationLabel,
      partialScoringLabel,
    }
  } = model;

  return [
    settingsChoiceLabel && (
      <FormControlLabel
        key={0}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.configure.editableChoiceLabel}
            onChange={() => updateModel(updateConfigureProp(model, 'editableChoiceLabel'))}
            value="checkedA"
          />
        }
        label={choiceLabel}
        labelPlacement="start"
      />
    ),

    settingsShuffle && (
      <FormControlLabel
        key={6}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.shuffle}
            onChange={() => updateModel(updateModelProp(model, 'shuffle'), true)}
            value="checkedA"
          />
        }
        label={shuffleLabel}
        labelPlacement="start"
      />
    ),

    settingsPartialScoring && (
      <FormControlLabel
        key={7}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.partialScoring}
            onChange={() => updateModel(updateModelProp(model, 'partialScoring'), true)}
            value="checkedA"
          />
        }
        label={partialScoringLabel}
        labelPlacement="start"
      />
    ),

    settingsPlacementArea && (
      <FormControlLabel
        key={1}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.placementArea}
            onChange={() => updateModel(updateModelProp(model, 'placementArea'))}
            value="checkedA"
          />
        }
        label={placementAreaLabel}
        labelPlacement="start"
      />
    ),

    (settingsNumberedGuides && model.placementArea) && (
      <FormControlLabel
        key={2}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.numberedGuides}
            onChange={() => updateModel(updateModelProp(model, 'numberedGuides'))}
            value="checkedA"
          />
        }
        label={numberedGuidesLabel}
        labelPlacement="start"
      />
    ),

    settingsEnableImages && (
      <FormControlLabel
        key={3}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.configure.imagesEnabled}
            onChange={() => updateModel(updateConfigureProp(model, 'imagesEnabled'))}
            value="checkedA"
          />
        }
        label={enableImagesLabel}
        labelPlacement="start"
      />
    ),

    settingsRemoveTileAfterPlacing && (
      <FormControlLabel
        key={4}
        style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
        control={
          <Switch
            checked={model.configure.removeTileAfterPlacing}
            onChange={() => updateModel(updateConfigureProp(model, 'removeTileAfterPlacing'), true)}
            value="checkedA"
          />
        }
        label={removeTilesLabel}
        labelPlacement="start"
      />
    ),

    settingsOrientation && <ChoiceType
      style={{ width: '100%' }}
      key={5}
      header={orientationLabel}
      value={model.choiceAreaLayout}
      onChange={value => updateModel({
        ...model,
        choiceAreaLayout: value
      })}
    />,
  ];
};

export default getSideMenuItems;