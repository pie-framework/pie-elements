import React from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import { styled } from '@mui/material/styles';

import { layout, settings } from '@pie-lib/config-ui';

import Scale from './scale';
import { MultiTraitButton } from './common';
import { ExcludeZeroDialog, excludeZeroTypes, IncludeZeroDialog, InfoDialog } from './modals';
import { addOrRemoveScaleColumn } from './utils';

const { Panel, toggle } = settings;
const MIN_WIDTH = '650px';

const StyledDiv = styled('div')(({ theme }) => ({
  fontFamily: 'Cerebri Sans',
  fontSize: theme.typography.fontSize,
  padding: '16px 0'
}));

const ShowModal = ({ showExcludeZeroDialog, excludeZero, changeExcludeZero, cancel }) => {
  if (showExcludeZeroDialog && !excludeZero) {
    return (
      <ExcludeZeroDialog
        open={showExcludeZeroDialog && !excludeZero}
        changeExcludeZero={changeExcludeZero}
        cancel={cancel}
      />
    );
  } else if (showExcludeZeroDialog && excludeZero) {
    return (
      <IncludeZeroDialog
        open={showExcludeZeroDialog && excludeZero}
        changeExcludeZero={changeExcludeZero}
        cancel={cancel}
      />
    );
  } else {
    return null;
  }
};

ShowModal.propTypes = {
  showExcludeZeroDialog: PropTypes.bool,
  excludeZero: PropTypes.bool,
  changeExcludeZero: PropTypes.func,
  cancel: PropTypes.func,
};

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.updateDivWidth = this.updateDivWidth.bind(this);
  }

  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    showExcludeZeroDialog: false,
    showInfoDialog: false,
    infoDialogText: '',
    adjustedWidth: MIN_WIDTH,
    initialUpdateCompleted: false, // flag to track the initial update of the div width
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDivWidthDebounced);
    window.addEventListener('load', this.updateDivWidth);

    // delay updateDivWidth to avoid having this.divRef.current = null at first load
    setTimeout(this.updateDivWidth, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDivWidthDebounced);
    window.removeEventListener('load', this.updateDivWidth);
  }

  componentDidUpdate() {
    if (!this.state.initialUpdateCompleted) {
      this.updateDivWidth();
      this.setState({ initialUpdateCompleted: true });
    }
  }

  updateDivWidth() {
    if (this.divRef && this.divRef.current) {
      const divWidth = this.divRef.current.offsetWidth;
      if (divWidth !== this.state.adjustedWidth) {
        this.set({
          adjustedWidth: divWidth,
        });
      }
    }
  }

  updateDivWidthDebounced = debounce(() => this.updateDivWidth(), 50);

  onScaleAdded = () => {
    const { model, onModelChanged, configuration } = this.props;
    let { scales, excludeZero } = model || {};
    const { maxNoOfScales } = configuration || {};
    let { defaultTraitLabel } = configuration || '';

    if (!scales.length) {
      scales = [];
    }

    // if no default trait label is defined, take the trait label of the first scale
    defaultTraitLabel = typeof defaultTraitLabel === 'string' ? defaultTraitLabel : scales[0]?.traitLabel || '';

    if (scales.length === maxNoOfScales) {
      this.set({
        infoDialogText: `There can't be more than ${maxNoOfScales} scales.`,
        showInfoDialog: true,
      });

      return false;
    }

    scales.push({
      maxPoints: 1,
      scorePointsLabels: excludeZero ? [''] : ['', ''],
      traitLabel: defaultTraitLabel,
      traits: [],
    });

    onModelChanged({ ...model, scales });
  };

  onScaleChanged = (scaleIndex, params) => {
    const { model, onModelChanged } = this.props;
    let scales = cloneDeep((model || {}).scales);

    if (scaleIndex < 0 || scaleIndex >= scales.length || isEmpty(params)) return false;

    Object.keys(params).forEach((key) => {
      scales[scaleIndex][key] = params[key];
    });

    if (model.excludeZero && params.maxPoints === 1) {
      // excludeZero should be false and disabled when maxPoints is 1 for any scale
      model.excludeZero = false;
      scales = addOrRemoveScaleColumn(scales, excludeZeroTypes.add0);
    }

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

  hideToggleExcludeZeroModal = () => {
    this.set({ showExcludeZeroDialog: false });
  };

  onCloseInfoDialog = () => this.set({ showInfoDialog: false });

  changeExcludeZero = (excludeZeroType) => {
    const { model, onModelChanged } = this.props || {};
    const { scales } = model || {};
    let { excludeZero } = model || {};

    if (!scales || !scales.length) return;

    excludeZero = !excludeZero;
    const newScales = addOrRemoveScaleColumn(scales, excludeZeroType);

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
    const { model, configuration, onConfigurationChanged, uploadSoundSupport, imageSupport } = this.props || {};
    const {
      addScale,
      baseInputConfiguration = {},
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
      mathMlOptions = {},
      maxMaxPoints,
      expandedInput = {},
      labelInput = {},
    } = configuration || {};
    const {
      errors,
      extraCSSRules,
      scales,
      excludeZero,
      description,
      pointLabels,
      standards,
      spellCheckEnabled,
      maxPointsEnabled,
      addScaleEnabled,
    } = model || {};
    const { showExcludeZeroDialog, showInfoDialog, infoDialogText, adjustedWidth } = this.state || {};

    // excludeZero should be false and disabled when maxPoints is 1 for any scale
    const disabledExcludeZero = scales?.some((scale) => scale.maxPoints === 1);

    const panelSettings = {
      standards: showStandards.settings && toggle(showStandards.label),
      'showLevelTagInput.enabled': showLevelTagInput.settings && toggle(showLevelTagInput.label, true),
      visibleToStudent: showVisibleToStudent.settings && toggle(showVisibleToStudent.label),
      excludeZero: showExcludeZero.settings && toggle(showExcludeZero.label, false, disabledExcludeZero),
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

    const getPluginProps = (props) => {
      return Object.assign(
        {
          ...baseInputConfiguration,
        },
        props || {},
      );
    };

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
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
            modal={
              <ShowModal
                showExcludeZeroDialog={showExcludeZeroDialog}
                excludeZero={excludeZero}
                changeExcludeZero={this.changeExcludeZero}
                cancel={this.hideToggleExcludeZeroModal}
              ></ShowModal>
            }
          />
        }
      >
        <div style={{ width: '100%' }} ref={this.divRef} />
        <StyledDiv style={{ width: width || adjustedWidth }}>
          {(scales || []).map((scale, scaleIndex) => (
            <Scale
              key={`scale-${scaleIndex}`}
              scale={scale}
              scaleIndex={scaleIndex}
              errors={errors}
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
              imageSupport={imageSupport}
              {...this.props}
              mathMlOptions={mathMlOptions}
              maxMaxPoints={maxMaxPoints}
              expandedPluginProps={getPluginProps(expandedInput?.inputConfiguration)}
              labelPluginProps={getPluginProps(labelInput?.inputConfiguration)}
            />
          ))}
          {addScaleEnabled && <MultiTraitButton onClick={this.onScaleAdded}>Add Scale</MultiTraitButton>}
        </StyledDiv>

        <InfoDialog open={showInfoDialog} text={infoDialogText} onClose={() => this.set({ showInfoDialog: false })} />
      </layout.ConfigLayout>
    );
  }
}

Main.propTypes = {
  model: PropTypes.object,
  uploadSoundSupport: PropTypes.object,
  configuration: PropTypes.object,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
};

export default Main;
