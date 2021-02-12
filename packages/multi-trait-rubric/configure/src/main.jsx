import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';

import {withStyles} from '@material-ui/core/styles';

import {withDragContext} from '@pie-lib/drag';
import {layout, settings} from '@pie-lib/config-ui';

import Scale from './scale';
import {MultiTraitButton} from './common';

import {ExcludeZeroDialog, excludeZeroTypes, IncludeZeroDialog} from './modals';

const {Panel, toggle} = settings;

const styles = {
  design: {
    fontFamily: 'Cerebri Sans',
    fontSize: '14px',
  }
};

export class Main extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    showExcludeZeroDialog: false,
  };

  onScaleAdded = () => {
    const {model, onModelChanged} = this.props;
    let {scales} = model || {};

    if (!scales.length) {
      scales = [];
    }

    scales.push({
      excludeZero: false,
      maxPoints: 1,
      scorePointsLabels: ['', ''],
      traitLabel: '',
      traits: []
    });

    onModelChanged({...model, scales});
  }

  onScaleChanged = (scaleIndex, params) => {
    const {model, onModelChanged} = this.props;
    const {scales} = model || {};

    if (scaleIndex < 0 || scaleIndex >= scales.length || isEmpty(params)) return false;

    Object.keys(params).forEach(key => {
      scales[scaleIndex][key] = params[key];
    });

    onModelChanged({...model, scales});
  };

  onScaleRemoved = (scaleIndex) => {
    const {model, onModelChanged} = this.props;
    let {scales} = model || {};

    if (scaleIndex < 0 || scaleIndex >= scales.length) return false;

    scales = [
      ...scales.slice(0, scaleIndex),
      ...scales.slice(scaleIndex + 1)
    ];

    onModelChanged({...model, scales});
  };

  onHalfScoringChanged = () => {
    const {model, onModelChanged} = this.props;
    let {halfScoring} = model || {};

    onModelChanged({...model, halfScoring: !halfScoring});
  };

  onVisibleToStudentChanged = () => {
    const {model, onModelChanged} = this.props;
    let {visibleToStudent} = model || {};

    onModelChanged({...model, visibleToStudent: !visibleToStudent});
  };

  set = (newState) => this.setState(newState);

  changeShowScorePointLabels = () => {
    const { model, onModelChanged } = this.props || {};
    let { pointLabels } = model || {};

    pointLabels = !pointLabels;

    onModelChanged({ ...model, pointLabels });
  }

  changeShowDescription = () => {
    const { model, onModelChanged } = this.props || {};
    let { description } = model || {};

    description = !description;

    onModelChanged({ ...model, description });
  }

  changeShowStandards = () => {
    const { model, onModelChanged } = this.props || {};
    let { standards } = model || {};

    standards = !standards;

    onModelChanged({ ...model, standards });
  }

  // Exclude Zero
  showToggleExcludeZeroModal = () => this.set({showExcludeZeroDialog: true});

  hideToggleExcludeZeroModal = () => this.set({showExcludeZeroDialog: false});

  changeExcludeZero = (excludeZeroType) => {
    const {model, onModelChanged} = this.props || {};
    const {scales} = model || {};
    let {excludeZero} = model || {};

    if (!scales || !scales.length) return;

    excludeZero = !excludeZero;

    const newScales = scales.reduce((acc, scale) => {
      let {scorePointsLabels, traits} = scale || {};

      if (scorePointsLabels.length < 1) return acc;

      switch (excludeZeroType) {
        case excludeZeroTypes.remove0: {
          // removes column 0
          scorePointsLabels = scorePointsLabels.slice(1);
          traits = traits.map(({scorePointsDescriptors, ...trait}) => ({
            ...trait,
            scorePointsDescriptors: scorePointsDescriptors.slice(1)
          }));

          break;
        }
        case excludeZeroTypes.add0: {
          // adds empty column at start
          scorePointsLabels = ['', ...scorePointsLabels];
          traits = traits.map(({scorePointsDescriptors, ...trait}) => ({
            ...trait,
            scorePointsDescriptors: ['', ...scorePointsDescriptors]
          }));

          break;
        }
        case excludeZeroTypes.shiftLeft: {
          // removes last column
          scorePointsLabels = scorePointsLabels.slice(0, -1);
          traits = traits.map(({scorePointsDescriptors, ...trait}) => ({
            ...trait,
            scorePointsDescriptors: scorePointsDescriptors.slice(0, -1)
          }));

          break;
        }
        case excludeZeroTypes.shiftRight: {
          // adds empty column at end
          scorePointsLabels = [...scorePointsLabels, ''];
          traits = traits.map(({scorePointsDescriptors, ...trait}) => ({
            ...trait,
            scorePointsDescriptors: [...scorePointsDescriptors, '']
          }));

          break;
        }
        default:
          break;
      }

      acc.push({
        ...scale,
        scorePointsLabels,
        traits
      });

      return acc;
    }, []);

    onModelChanged({...model, scales: newScales, excludeZero});

    this.hideToggleExcludeZeroModal();
  }

  onModelChanged = (updatedModel, updatedProperty) => {
    const {onModelChanged} = this.props || {};

    if (updatedProperty === 'excludeZero') {
      this.showToggleExcludeZeroModal();
    } else {
      onModelChanged(updatedModel);
    }
  }

  render() {
    const {model, classes, configuration, onConfigurationChanged} = this.props || {};
    const {
      showStandards,
      showExcludeZero,
      showLevelTagInput,
      showDescription,
      showVisibleToStudent,
      showHalfScoring,
      showScorePointLabels,
      dragAndDrop
    } = configuration || {};
    const {scales, excludeZero, description, pointLabels, standards} = model || {};
    const {showExcludeZeroDialog} = this.state || {};

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={this.onModelChanged}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  standards: showStandards.settings && toggle(showStandards.label),
                  'showLevelTagInput.enabled': showLevelTagInput.settings && toggle(showLevelTagInput.label, true),
                  visibleToStudent: showVisibleToStudent.settings && toggle(showVisibleToStudent.label),
                  excludeZero: showExcludeZero.settings && toggle(showExcludeZero.label),
                  halfScoring: showHalfScoring.settings && toggle(showHalfScoring.label),
                  'dragAndDrop.enabled': dragAndDrop.settings && toggle(dragAndDrop.label, true)
                },
                Properties: {
                  description: showDescription.settings && toggle(showDescription.label),
                  pointLabels: showScorePointLabels.settings && toggle(showScorePointLabels.label)
                }
              }}
            />
          }
        >
          {/*TODO:*/}
          <div style={{maxWidth: '1000px'}}>
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
                {...this.props}
              />
            ))}

            <MultiTraitButton onClick={this.onScaleAdded}>
              Add Scale
            </MultiTraitButton>
          </div>
        </layout.ConfigLayout>

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
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  configuration: PropTypes.object,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
}

export default withDragContext(withStyles(styles)(Main));
