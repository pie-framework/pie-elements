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
  },
  full: {
    display: 'flex',
    flexDirection: 'row'
  }
};

const maxScoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export class Scale extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
  };

  set = (newState) => this.setState(newState);

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
    let { traits } = scale || {};

    if (traitToDeleteIndex < 0 || traitToDeleteIndex >= traits.length) return;

    traits = [
      ...traits.slice(0, traitToDeleteIndex),
      ...traits.slice(traitToDeleteIndex + 1)
    ];

    onScaleChanged(scaleIndex, { traits });

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

    if (traitIndex >= 0 && traitIndex < traits.length) {
      traits[traitIndex] = trait;

      onScaleChanged(scaleIndex, { traits });
    }
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
    const {
      classes,
      scale,
      scaleIndex,
      showStandards,
      onScaleChanged,
      excludeZero,
      showDescription,
      showLevelTagInput
    } = this.props || {};
    const {
      maxPoints,
      scorePointsLabels,
      traitLabel,
      traits
    } = scale || {};

    const {
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
          <Delete
            classes={{ root: classes.addCircle }}
            onClick={this.showDeleteScaleModal}
          />
        </div>

        <TraitsHeader
          key={'header-key'}
          traitLabel={traitLabel}
          scorePointsValues={scorePointsValues}
          scorePointsLabels={scorePointsLabels}
          onScaleChange={(params) => onScaleChanged(scaleIndex, params)}
          onTraitLabelChange={label => onScaleChanged(scaleIndex, { traitLabel: label })}
          showStandards={showStandards}
          showDescription={showDescription}
          showLevelTagInput={showLevelTagInput}
          maxPoints={maxPoints}
          maxScoreOptions={maxScoreOptions}
          updateMaxPointsFieldValue={this.updateMaxPointsFieldValue}
          scaleIndex={scaleIndex}
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
            showDescription={showDescription}
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
  scale: PropTypes.shape({
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
  excludeZero: PropTypes.bool,
  scaleIndex: PropTypes.number,
  onScaleChanged: PropTypes.func,
  onScaleRemoved: PropTypes.func,
  showStandards: PropTypes.bool,
  showLevelTagInput: PropTypes.bool,
  showDescription: PropTypes.bool,
}

export default withDragContext(withStyles(styles)(Scale));
