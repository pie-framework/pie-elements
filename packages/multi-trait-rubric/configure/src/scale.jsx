import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, FormControlLabel } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import AddCircle from '@material-ui/icons/AddCircle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import { withDragContext } from '@pie-lib/drag';

import TraitsHeader from './traitsHeader';
import TraitTile from './trait';
import {
  DecreaseMaxPoints,
  DeleteScale,
  DeleteTrait,
  ExcludeZeroDialog,
  IncludeZeroDialog,
  excludeZeroTypes
} from './modals';

const inputStyles = {
  root: {
    'label + &': {
      marginTop: '24px',
      marginBottom: '24px',
      width: '180px'
    },
  },
  input: {
    borderRadius: '4px',
    position: 'relative',
    border: '1px solid #ced4da',
    fontSize: '16px',
    padding: '10px 26px 10px 12px',

    '&:focus': {
      borderRadius: '4px',
    }
  },
};

const BootstrapInput = withStyles(inputStyles)(InputBase);

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
  maxPoints: {
    width: '300px',
    margin: '16px 0 32px'
  },
  scaleWrapper: {
    border: '1px solid lightgrey',
    display: 'flex',
    flexDirection: 'column',
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

const maxScoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export class Scale extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    showExcludeZeroDialog: false,
  };

  set = (newState) => this.setState(newState);

  // Exclude Zero
  showToggleExcludeZeroModal = () => this.set({ showExcludeZeroDialog: true });

  hideToggleExcludeZeroModal = () => this.set({ showExcludeZeroDialog: false });

  changeExcludeZero = (excludeZeroType) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    let { excludeZero, scorePointsLabels, traits } = scale || {};

    excludeZero = !excludeZero;

    this.hideToggleExcludeZeroModal();

    switch (excludeZeroType) {
      case excludeZeroTypes.remove0: {
        // removes column 0
        scorePointsLabels = scorePointsLabels.slice(1);
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: scorePointsDescriptors.slice(1)
        }));

        break;
      }
      case excludeZeroTypes.add0: {
        // adds empty column at start
        scorePointsLabels = ['', ...scorePointsLabels];
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: ['', ...scorePointsDescriptors]
        }));

        break;
      }
      case excludeZeroTypes.shiftLeft: {
        // removes last column
        scorePointsLabels = scorePointsLabels.slice(0, -1);
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: scorePointsDescriptors.slice(0, -1)
        }));

        break;
      }
      case excludeZeroTypes.shiftRight: {
        // adds empty column at end
        scorePointsLabels = [...scorePointsLabels, ''];
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: [...scorePointsDescriptors, '']
        }));

        break;
      }
      default:
        break;
    }

    onScaleChanged(scaleIndex, { excludeZero, scorePointsLabels, traits });
  }

  // Max Points
  updateMaxPointsFieldValue = ({ target }) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { maxPoints } = scale;

    const numberValue = parseInt(target.value, 10);

    if (numberValue < maxPoints) {
      this.showDecreaseMaxPointsModal({ newMaxPoints: numberValue });
    } else {
      onScaleChanged(scaleIndex, { maxPoints: numberValue })
    }
  }

  showDecreaseMaxPointsModal = ({ newMaxPoints }) => this.set({ showDecreaseMaxPointsDialog: true, newMaxPoints });

  hideDecreaseMaxPointsModal = () => this.set({ showDecreaseMaxPointsDialog: false, newMaxPoints: undefined });

  changeMaxPoints = () => {
    const { newMaxPoints } = this.state || {};
    const { scaleIndex, onScaleChanged } = this.props || {};

    if (newMaxPoints) {
      onScaleChanged(scaleIndex, { maxPoints: newMaxPoints });
    }

    this.hideDecreaseMaxPointsModal();
  }

  // Delete Scale
  showDeleteScaleModal = () => this.set({ showDeleteScaleDialog: true });

  hideDeleteScaleModal = () => this.set({ showDeleteScaleDialog: false });

  deleteScale = () => {
    const { scaleIndex, onScaleRemoved } = this.props || {};

    this.hideDeleteScaleModal();

    onScaleRemoved(scaleIndex);
  }

  // Delete Trait
  showDeleteTraitModal = (traitToDeleteIndex) => this.set({ showDeleteTraitDialog: true, traitToDeleteIndex });

  hideDeleteTraitModal = () => this.set({ showDeleteTraitDialog: false, traitToDeleteIndex: undefined });

  onTraitRemoved = () => {
    const { traitToDeleteIndex } = this.state;
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits } = scale || {};

    if (traitToDeleteIndex >= 0) {
      delete traits[traitToDeleteIndex];

      onScaleChanged(scaleIndex, { traits });
    }

    this.hideDeleteTraitModal();
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
    const { classes, scale, scaleIndex, showStandards, onScaleChanged } = this.props || {};
    const {
      excludeZero,
      maxPoints,
      scorePointsLabels,
      traitLabel,
      traits
    } = scale || {};
    const {
      showExcludeZeroDialog,
      showDecreaseMaxPointsDialog,
      showDeleteScaleDialog,
      showDeleteTraitDialog
    } = this.state;

    const scorePointsValues = [];

    // determining the score points values
    for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue -= 1) {
      scorePointsValues.push(pointValue);
    }

    return (
      <div key={`scale-${scaleIndex}`} className={classes.scaleWrapper}>
        <div className={classes.scaleTitleWrapper}>
          <h3 style={{ color: 'grey' }}>
            Scale #{scaleIndex}
          </h3>
          <Delete
            classes={{ root: classes.addCircle }}
            onClick={this.showDeleteScaleModal}
          />
        </div>

        <FormControlLabel
          label="Exclude Zero"
          value="exclude_zero"
          control={
            <Checkbox
              color="primary"
              checked={excludeZero}
              onChange={this.showToggleExcludeZeroModal}
            />
          }
        />

        <FormControl className={classes.margin}>
          <InputLabel>
            Max Points
          </InputLabel>
          <Select
            value={maxPoints}
            onChange={this.updateMaxPointsFieldValue}
            input={<BootstrapInput/>}
          >
            {maxScoreOptions.map(maxScore => (
              <MenuItem
                key={`menu-item-${maxScore}`}
                value={maxScore}
              >
                {maxScore}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TraitsHeader
          key={'header-key'}
          traitLabel={traitLabel}
          scorePointsValues={scorePointsValues}
          scorePointsLabels={scorePointsLabels}
          onScaleChange={(params) => onScaleChanged(scaleIndex, params)}
          onTraitLabelChange={label => onScaleChanged(scaleIndex, { traitLabel: label })}
          showStandards={showStandards}
        />

        {traits.map((trait, index) => (
          <TraitTile
            key={index}
            index={index}
            trait={trait}
            scorePointsValues={scorePointsValues}
            scorePointsLabels={scorePointsLabels}
            onTraitRemoved={() => this.showDeleteTraitModal(index)}
            onTraitChanged={trait => this.onTraitChanged(index, trait)}
            onTraitDropped={this.onTraitDropped}
            showStandards={showStandards}
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

        <DecreaseMaxPoints
          open={!!showDecreaseMaxPointsDialog}
          deleteScorePoints={this.changeMaxPoints}
          cancel={this.hideDecreaseMaxPointsModal}
        />

        <DeleteScale
          open={!!showDeleteScaleDialog}
          scaleIndex={scaleIndex}
          deleteScale={this.deleteScale}
          cancel={this.hideDeleteScaleModal}
        />

        <DeleteTrait
          open={!!showDeleteTraitDialog}
          deleteTrait={this.onTraitRemoved}
          cancel={this.hideDeleteTraitModal}
        />
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
  onScaleRemoved: PropTypes.func,
  showStandards: PropTypes.bool
}

export default withDragContext(withStyles(styles)(Scale));
