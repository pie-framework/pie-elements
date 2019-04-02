import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType } from './choice-type';

const onChoiceLabelAreaChange = ({ model, updateModel }) => {
  model.configure.editableChoiceLabel = !model.configure.editableChoiceLabel;
  updateModel(model);
};

const onPartialScoringChange = ({ model, updateModel }) => {
  model.partialScoring = !model.partialScoring;
  updateModel(model, true);
};

const onPlacementAreaChange = ({ model, updateModel }) => {
  model.placementArea = !model.placementArea;
  updateModel(model);
};

const onLayoutChange = ({ model, updateModel }, value) => {
  model.choiceAreaLayout = value;
  updateModel(model);
};

const onNumberedGuidesChange = ({ model, updateModel }) => {
  model.numberedGuides = !model.numberedGuides;
  updateModel(model);
};

const onEnableImagesChange = ({ model, updateModel }) => {
  model.configure.imagesEnabled = !model.configure.imagesEnabled;
  updateModel(model);
};

const onRemoveTileAfterPlacingChange = ({ model, updateModel }) => {
  model.configure.removeTileAfterPlacing = !model.configure.removeTileAfterPlacing;

  updateModel(model);
};

const onShuffleChange = ({ model, updateModel }) => {
  model.shuffle = !model.shuffle;

  updateModel(model, true);
};

const renderFormControlLabel = ({ key, checked, onChange, label }) => (
  <FormControlLabel
    key={key}
    style={{ justifyContent: 'flex-end', margin: 0, width: '33%' }}
    control={
      <Switch
        checked={checked}
        onChange={onChange}
        value="checkedA"
      />
    }
    label={label}
    labelPlacement="start"
  />
);

const getSideMenuItems = (props) => {
  const { model } = props;
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
    settingsChoiceLabel && renderFormControlLabel({ key: 0, checked: model.configure.editableChoiceLabel, onChange: () => onChoiceLabelAreaChange(props), label: choiceLabel}),
    settingsShuffle && renderFormControlLabel({ key: 6, checked: model.shuffle, onChange: () => onShuffleChange(props), label: shuffleLabel}),
    settingsPartialScoring && renderFormControlLabel({ key: 7, checked: model.partialScoring, onChange: () => onPartialScoringChange(props), label: partialScoringLabel}),

    settingsPlacementArea && renderFormControlLabel({ key: 1, checked: model.placementArea, onChange: () => onPlacementAreaChange(props), label: placementAreaLabel}),
    (settingsNumberedGuides && model.placementArea) && renderFormControlLabel({ key: 2, checked: model.numberedGuides, onChange: () => onNumberedGuidesChange(props), label: numberedGuidesLabel}),
    settingsEnableImages && renderFormControlLabel({ key: 3, checked: model.configure.imagesEnabled, onChange: () => onEnableImagesChange(props), label: enableImagesLabel}),
    settingsRemoveTileAfterPlacing && renderFormControlLabel({ key: 4, checked: model.configure.removeTileAfterPlacing, onChange: () => onRemoveTileAfterPlacingChange(props), label: removeTilesLabel}),

    settingsOrientation && <ChoiceType
      style={{ width: '100%' }}
      key={5}
      header={orientationLabel}
      value={model.choiceAreaLayout}
      onChange={value => onLayoutChange(props, value)}
    />,
  ];
};

export default getSideMenuItems;