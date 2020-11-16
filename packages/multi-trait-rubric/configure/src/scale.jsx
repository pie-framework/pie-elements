import React from 'react';
import PropTypes from 'prop-types';

import Delete from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import AddCircle from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { withDragContext } from '@pie-lib/drag';

import TraitsHeader from './traitsHeader';
import TraitTile from './trait';

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
  },
  scaleWrapper: {
    border: '1px solid lightgrey',
    padding: '16px',
    margin: '12px 0',
    wordBreak: 'break-word'
  },
  scaleTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  trait: {
    background: '#f1f1f1',
    margin: '16px 0',
    padding: '16px'
  }
};

export class Scale extends React.Component {
  changeExcludeZero = () => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { excludeZero } = scale || {};

    onScaleChanged(scaleIndex, { excludeZero: !excludeZero });
  }

  changeMaxPoints = ({ target }) => {
    const { scaleIndex, onScaleChanged } = this.props || {};
    const numberValue = parseInt(target.value, 10);

    onScaleChanged(scaleIndex, { maxPoints: numberValue })
  }

  onTraitAdded = () => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits, scorePointsLabels } = scale || {};

    traits.push({
      name: '',
      description: '',
      standards: [],
      scorePointsDescriptors: Array.from(
        { length: scorePointsLabels.length },
        () => ''
      ),
    });

    onScaleChanged(scaleIndex, { traits });
  }

  onTraitRemoved = (traitIndex) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits } = scale || {};

    delete traits[traitIndex];

    onScaleChanged(scaleIndex, { traits });
  }

  onTraitChanged = (traitIndex, trait) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits } = scale || {};

    traits[traitIndex] = trait;

    onScaleChanged(scaleIndex, { traits });
  }

  onTraitDropped = (source, newIndex) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits } = scale || {};
    const { index: oldIndex } = source;
    const cup = traits[oldIndex];

    traits[oldIndex] = traits[newIndex];
    traits[newIndex] = cup;

    onScaleChanged(scaleIndex, { traits });
  }

  render() {
    const { classes, scale, scaleIndex, onScaleChanged, onScaleRemoved } = this.props || {};
    const { excludeZero, maxPoints, scorePointsLabels, traitLabel, traits } = scale || {};

    const scorePointsValues = [];

    // determining the score points values
    for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue -= 1) {
      scorePointsValues.push(pointValue);
    }

    return (
      <div key={`scale-${scaleIndex}`} className={classes.scaleWrapper}>
        <div className={classes.scaleTitleWrapper}>
          <h3 style={{ color: 'grey' }}>Scale #{scaleIndex}</h3>
          <Delete
            classes={{ root: classes.addCircle }}
            onClick={() => onScaleRemoved(scaleIndex)}
          />
        </div>

        <FormControlLabel
          label="Exclude Zero"
          value="exclude_zero"
          control={
            <Checkbox
              color="primary"
              checked={excludeZero}
              onChange={this.changeExcludeZero}
            />
          }
        />

        <TextField
          label='Max Points'
          type="number"
          inputProps={{ min: 1, max: 10 }}
          value={maxPoints}
          onChange={this.changeMaxPoints}
          fullWidth
        />

        <TraitsHeader
          key={'header-key'}
          traitLabel={traitLabel}
          scorePointsValues={scorePointsValues}
          scorePointsLabels={scorePointsLabels}
          onScaleChange={(params) => onScaleChanged(scaleIndex, params)}
          onTraitLabelChange={label => onScaleChanged(scaleIndex, { traitLabel: label })}
        />

        {traits.map((trait, index) => (
          <TraitTile
            key={index}
            index={index}
            trait={trait}
            scorePointsValues={scorePointsValues}
            scorePointsLabels={scorePointsLabels}
            onTraitRemoved={() => this.onTraitRemoved(index)}
            onTraitChanged={trait => this.onTraitChanged(index, trait)}
            onTraitDropped={this.onTraitDropped}
          />
        ))}

        <div className={classes.buttonWrapper}>
          <div>
            <div>Add</div>
            <div dangerouslySetInnerHTML={{ __html: traitLabel || ' Trait' }}/>
          </div>

          <AddCircle
            classes={{ root: classes.addCircle }}
            onClick={this.onTraitAdded}
          />
        </div>
      </div>
    );
  }
}

Scale.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  onModelChanged: PropTypes.func,
  scale: PropTypes.shape({
    excludeZero: PropTypes.bool,
    maxPoints: PropTypes.number,
    scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
    traitLabel: PropTypes.string,
    traits: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      standards: PropTypes.arrayOf(PropTypes.string),
      scorePointsDescriptors: PropTypes.arrayOf(PropTypes.string),
      description: PropTypes.string,
    }))
  }),
  scaleIndex: PropTypes.number,
  onScaleChanged: PropTypes.func,
  onScaleRemoved: PropTypes.func
}

export default withDragContext(withStyles(styles)(Scale));
