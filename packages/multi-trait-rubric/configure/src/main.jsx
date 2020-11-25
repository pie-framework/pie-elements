import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';

import AddCircle from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { withDragContext } from '@pie-lib/drag';
import { layout, settings } from '@pie-lib/config-ui';

import Scale from './scale';

const { Panel, toggle } = settings;

const styles = {
  addCircle: {
    fill: 'grey',
    marginLeft: '16px',
    height: '30px',
    width: '30px'
  },
  buttonWrapper: {
    alignItems: 'center',
    color: 'grey',
    display: 'flex',
    fontSize: '16px',
    justifyContent: 'flex-end',
    textAlign: 'right'
  }
};

export class Main extends React.Component {
  onScaleAdded = () => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

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

    onModelChanged({ ...model, scales });
  }

  onScaleChanged = (scaleIndex, params) => {
    const { model, onModelChanged } = this.props;
    const { scales } = model || {};

    if (scaleIndex < 0 || scaleIndex >= scales.length || isEmpty(params)) return false;

    Object.keys(params).forEach(key => {
      scales[scaleIndex][key] = params[key];
    });

    onModelChanged({ ...model, scales });
  };

  onScaleRemoved = (scaleIndex) => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

    if (scaleIndex < 0 || scaleIndex >= scales.length) return false;

    scales = [
      ...scales.slice(0, scaleIndex),
      ...scales.slice(scaleIndex + 1)
    ];

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

  render() {
    const { model, classes, configuration, onConfigurationChanged, onModelChanged } = this.props || {};
    const { scales, visibleToStudent, halfScoring } = model || {};
    const { showStandards } = configuration || {};

    return (
      <div className={classes.design}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onModelChanged}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: {
                  'showStandards.enabled': showStandards.settings && toggle(showStandards.label, true),
                },
              }}
            />
          }
        >
          <div style={{ width: '60vw' }}>
            <FormControlLabel
              label="Half Scoring"
              value="half_scoring"
              control={
                <Checkbox
                  color="primary"
                  checked={halfScoring}
                  onChange={this.onHalfScoringChanged}
                />
              }
            />

            <FormControlLabel
              label="Visible to Students"
              value="visible_to_students"
              control={
                <Checkbox
                  color="primary"
                  checked={visibleToStudent}
                  onChange={this.onVisibleToStudentChanged}
                />
              }
            />

            {scales.map((scale, scaleIndex) => (
              <Scale
                key={`scale-${scaleIndex}`}
                scale={scale}
                scaleIndex={scaleIndex}
                onScaleRemoved={this.onScaleRemoved}
                onScaleChanged={this.onScaleChanged}
                showStandards={showStandards.enabled}
                {...this.props}
              />
            ))}


            <div className={classes.buttonWrapper}>
              <div>Add Scale</div>
              <AddCircle
                classes={{ root: classes.addCircle }}
                onClick={this.onScaleAdded}
              />
            </div>
          </div>
        </layout.ConfigLayout>
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
