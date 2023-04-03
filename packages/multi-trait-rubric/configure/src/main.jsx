import React from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { withStyles } from '@material-ui/core/styles';

import { withDragContext } from '@pie-lib/drag';
import { layout, settings } from '@pie-lib/config-ui';

import Scale from './scale';
import { MultiTraitButton } from './common';
import { ExcludeZeroDialog, excludeZeroTypes, IncludeZeroDialog, InfoDialog } from './modals';

const { Panel, toggle } = settings;
const MIN_WIDTH = '650px';

const styles = (theme) => ({
  design: {
    fontFamily: 'Cerebri Sans',
    fontSize: theme.typography.fontSize,
  },
});

export class Main extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    showExcludeZeroDialog: false,
    showInfoDialog: false,
    infoDialogText: '',
  };

  onScaleAdded = () => {
    const { model, onModelChanged, configuration } = this.props;
    let { scales } = model || {};
    const { maxNoOfScales } = configuration || {};
    let { defaultTraitLabel } = configuration || '';

    if (!scales.length) {
      scales = [];
    }

    // if no default trait label is defined, take the trait label of the first scale
    defaultTraitLabel = defaultTraitLabel || (scales[0] ? scales[0].traitLabel : '');

    if (scales.length === maxNoOfScales) {
      this.set({
        infoDialogText: `There can't be more than ${maxNoOfScales} scales.`,
        showInfoDialog: true,
      });

      return false;
    }

    scales.push({
      excludeZero: false,
      maxPoints: 1,
      scorePointsLabels: ['', ''],
      traitLabel: defaultTraitLabel,
      traits: [],
    });

    onModelChanged({ ...model, scales });
  };

  onScaleChanged = (scaleIndex, params) => {
    const { model, onModelChanged } = this.props;
    const scales = cloneDeep((model || {}).scales);

    if (scaleIndex < 0 || scaleIndex >= scales.length || isEmpty(params)) return false;

    Object.keys(params).forEach((key) => {
      scales[scaleIndex][key] = params[key];
    });

    onModelChanged({ ...model, scales });
  };

  onScaleRemoved = (scaleIndex) => {
    const { model, onModelChanged, configuration } = this.props;
    let { scales } = model || {};
    const { minNoOfScales } = configuration || {};

    if (scaleIndex < 0 || scaleIndex >= scales.length) return false;

    if (scales.length === minNoOfScales) {
      this.set({
        infoDialogText: `There can't be less than ${minNoOfScales} scales.`,
        showInfoDialog: true,
      });

      return false;
    }

    scales = [...scales.slice(0, scaleIndex), ...scales.slice(scaleIndex + 1)];

    onModelChanged({ ...model, scales });
  };

  onHalfScoringChanged = () => {
    const { model, onModelChanged } = this.props;
    let { halfScoring } = model || {};

    onModelChanged({ ...model, halfScoring: !halfScoring });
  };

  onVisibleToStudentChanged = () => {
    const { model, onModelChanged } = this.props;
    let { visibleToStudent } = model || {};

    onModelChanged({ ...model, visibleToStudent: !visibleToStudent });
  };

  set = (newState) => this.setState(newState);

  changeShowScorePointLabels = () => {
    const { model, onModelChanged } = this.props || {};
    let { pointLabels } = model || {};

    pointLabels = !pointLabels;

    onModelChanged({ ...model, pointLabels });
  };

  changeShowDescription = () => {
    const { model, onModelChanged } = this.props || {};
    let { description } = model || {};

    description = !description;

    onModelChanged({ ...model, description });
  };

  changeShowStandards = () => {
    const { model, onModelChanged } = this.props || {};
    let { standards } = model || {};

    standards = !standards;

    onModelChanged({ ...model, standards });
  };

  // Exclude Zero
  showToggleExcludeZeroModal = () => this.set({ showExcludeZeroDialog: true });

  hideToggleExcludeZeroModal = () => this.set({ showExcludeZeroDialog: false });

  changeExcludeZero = (excludeZeroType) => {
    const { model, onModelChanged } = this.props || {};
    const { scales } = model || {};
    let { excludeZero } = model || {};

    if (!scales || !scales.length) return;

    excludeZero = !excludeZero;

    const newScales = scales.reduce((acc, scale) => {
      let { scorePointsLabels, traits } = scale || {};

      if (scorePointsLabels.length < 1) return acc;

      switch (excludeZeroType) {
        case excludeZeroTypes.remove0: {
          // removes column 0
          scorePointsLabels = scorePointsLabels.slice(1);
          traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
            ...trait,
            scorePointsDescriptors: scorePointsDescriptors.slice(1),
          }));

          break;
        }

        case excludeZeroTypes.add0: {
          // adds empty column at start
          scorePointsLabels = ['', ...scorePointsLabels];
          traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
            ...trait,
            scorePointsDescriptors: ['', ...scorePointsDescriptors],
          }));

          break;
        }

        case excludeZeroTypes.shiftLeft: {
          // removes last column
          scorePointsLabels = scorePointsLabels.slice(0, -1);
          traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
            ...trait,
            scorePointsDescriptors: scorePointsDescriptors.slice(0, -1),
          }));

          break;
        }

        case excludeZeroTypes.shiftRight: {
          // adds empty column at end
          scorePointsLabels = [...scorePointsLabels, ''];
          traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
            ...trait,
            scorePointsDescriptors: [...scorePointsDescriptors, ''],
          }));

          break;
        }

        default:
          break;
      }

      acc.push({ ...scale, scorePointsLabels, traits });

      return acc;
    }, []);

    onModelChanged({ ...model, scales: newScales, excludeZero });

    this.hideToggleExcludeZeroModal();
  };

  onModelChanged = (updatedModel, updatedProperty) => {
    const { onModelChanged } = this.props || {};

    if (updatedProperty === 'excludeZero') {
      this.showToggleExcludeZeroModal();
    } else {
      onModelChanged(updatedModel);
    }
  };

  render() {
    const { model, classes, configuration, onConfigurationChanged, uploadSoundSupport } = this.props || {};
    const {
      addScale,
      dragAndDrop,
      contentDimensions = {},
      showDescription,
      showExcludeZero,
      showLevelTagInput,
      showStandards,
      showHalfScoring,
      showMaxPoint,
      showScorePointLabels,
      showVisibleToStudent,
      spellCheck = {},
      settingsPanelDisabled,
      maxNoOfTraits,
      minNoOfTraits,
      width,
    } = configuration || {};
    const {
      scales,
      excludeZero,
      description,
      pointLabels,
      standards,
      spellCheckEnabled,
      maxPointsEnabled,
      addScaleEnabled,
    } = model || {};
    const { showExcludeZeroDialog, showInfoDialog, infoDialogText } = this.state || {};
    const adjustedWidth = parseInt(width) > parseInt(MIN_WIDTH) ? width : MIN_WIDTH;

    const panelSettings = {
      standards: showStandards.settings && toggle(showStandards.label),
      'showLevelTagInput.enabled': showLevelTagInput.settings && toggle(showLevelTagInput.label, true),
      visibleToStudent: showVisibleToStudent.settings && toggle(showVisibleToStudent.label),
      excludeZero: showExcludeZero.settings && toggle(showExcludeZero.label),
      halfScoring: showHalfScoring.settings && toggle(showHalfScoring.label),
      'dragAndDrop.enabled': dragAndDrop.settings && toggle(dragAndDrop.label, true),
    };
    const panelProperties = {
      description: showDescription.settings && toggle(showDescription.label),
      pointLabels: showScorePointLabels.settings && toggle(showScorePointLabels.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      maxPointsEnabled: showMaxPoint.settings && toggle(showMaxPoint.label),
      addScaleEnabled: addScale.settings && toggle(addScale.label),
    };

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            onChangeModel={this.onModelChanged}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        <div style={{ width: adjustedWidth }}>
          {(scales || []).map((scale, scaleIndex) => (
            <Scale
              key={`scale-${scaleIndex}`}
              scale={scale}
              scaleIndex={scaleIndex}
              onScaleRemoved={this.onScaleRemoved}
              onScaleChanged={this.onScaleChanged}
              showStandards={standards}
              showScorePointLabels={pointLabels}
              showDescription={description}
              showLevelTagInput={showLevelTagInput.enabled}
              excludeZero={excludeZero}
              enableDragAndDrop={dragAndDrop.enabled}
              spellCheck={spellCheckEnabled}
              width={adjustedWidth}
              uploadSoundSupport={uploadSoundSupport}
              maxPointsEnabled={maxPointsEnabled}
              maxNoOfTraits={maxNoOfTraits}
              minNoOfTraits={minNoOfTraits}
              {...this.props}
              classes={{}}
            />
          ))}
          {addScaleEnabled && <MultiTraitButton onClick={this.onScaleAdded}>Add Scale</MultiTraitButton>}
        </div>

        <ExcludeZeroDialog
          open={showExcludeZeroDialog && !excludeZero}
          changeExcludeZero={this.changeExcludeZero}
          cancel={this.hideToggleExcludeZeroModal}
        />

        <IncludeZeroDialog
          open={showExcludeZeroDialog && excludeZero}
          changeExcludeZero={this.changeExcludeZero}
          cancel={this.hideToggleExcludeZeroModal}
        />

        <InfoDialog open={showInfoDialog} text={infoDialogText} onClose={() => this.set({ showInfoDialog: false })} />
      </layout.ConfigLayout>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  uploadSoundSupport: PropTypes.object,
  configuration: PropTypes.object,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
};

export default withDragContext(withStyles(styles)(Main));
