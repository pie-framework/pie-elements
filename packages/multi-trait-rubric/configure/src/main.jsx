import React from 'react';
import PropTypes from 'prop-types';

import AddCircle from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/core/styles';

import { withDragContext } from '@pie-lib/drag';

import Scale from './scale';

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

    scales.push({
      excludeZero: false,
      maxPoints: 1,
      scorePointsLabels: ['', ''],
      traitLabel: '',
      traits: []
    });

    onModelChanged({ ...model, scales });
  }

  onScaleChanged = (s, params) => {
    const { model, onModelChanged } = this.props;
    const { scales } = model || {};

    Object.keys(params).forEach(key => {
      scales[s][key] = params[key];
    });

    onModelChanged({ ...model, scales });
  }

  onScaleRemoved = (index) => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

    scales = [
      ...scales.slice(0, index),
      ...scales.slice(index + 1)
    ];

    onModelChanged({ ...model, scales });
  }

  render() {
    const { model, classes } = this.props || {};
    const { scales } = model || {};

    return (
      <div style={{ width: '60vw' }}>
        {scales.map((scale, scaleIndex) => (
          <Scale
            key={`scale-${scaleIndex}`}
            scale={scale}
            scaleIndex={scaleIndex}
            onScaleRemoved={this.onScaleRemoved}
            onScaleChanged={this.onScaleChanged}
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
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  onModelChanged: PropTypes.func,
}

export default withDragContext(withStyles(styles)(Main));
