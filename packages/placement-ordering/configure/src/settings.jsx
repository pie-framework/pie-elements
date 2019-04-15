import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType } from './choice-type';
import { settings } from '@pie-lib/config-ui';

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
      choiceLabel,
      placementArea,
      numberedGuides,
      enableImages,
      orientation,
      removeTilesAfterPlacing,
      partialScoring,
      lockChoiceOrder,

      teacherInstructions,
      studentInstructions,
      rationale,
      scoringType,
    }
  } = model;

  const { Panel, toggle, radio } = settings;

  return (
    <Panel
      model={model}
      onChange={model => updateModel(model)}
      groups={{
        'Item Type': {
          'configure.choiceLabel.enabled': choiceLabel.settings && toggle(choiceLabel.label),
          placementArea: placementArea.settings && toggle(placementArea.label),
          numberedGuides: (numberedGuides.settings && model.placementArea) && toggle(numberedGuides.label),
          enableImages: enableImages.settings && toggle(enableImages.label),
          orientation: orientation.settings && radio(orientation.label, 'vertical', 'horizontal'),
          removeTilesAfterPlacing: removeTilesAfterPlacing.settings && toggle(removeTilesAfterPlacing.label),
          partialScoring: partialScoring.settings && toggle(partialScoring.label),
        },
        'Properties': {
          'configure.teacherInstructions.enabled': teacherInstructions.settings && toggle(teacherInstructions.label),
          'configure.studentInstructions.enabled': studentInstructions.settings && toggle(studentInstructions.label),
          'configure.rationale.enabled': rationale.settings && toggle(rationale.label),
          lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
          scoringType: scoringType.settings && radio(scoringType.label, 'auto', 'rubric'),
        },
      }}
    />
  );
};

export default getSideMenuItems;