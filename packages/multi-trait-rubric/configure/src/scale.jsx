import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { withDragContext } from '@pie-lib/drag';
import { color } from '@pie-lib/render-ui';

import TraitsHeader from './traitsHeader';
import TraitTile from './trait';
import {
  Arrow,
  BlockWidth,
  DragHandleSpace,
  MultiTraitButton,
  PrimaryBlockWidth
} from './common';
import {
  DecreaseMaxPoints,
  DeleteScale,
  DeleteTrait,
} from './modals';

const AdjustedBlockWidth = BlockWidth + (2 * 8); // 8 is padding

const styles = {
  scaleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '12px 0',
    wordBreak: 'break-word',
    padding: `16px 0 16px ${DragHandleSpace}px`,
    position: 'relative'
  },
  maxPoints: {
    width: '300px',
    margin: '16px 0 32px'
  },
  trait: {
    background: color.secondaryBackground(),
    margin: '16px 0',
    padding: '16px'
  }
};

export class Scale extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    currentPosition: 0,
    showRight: null,
    showLeft: null
  };

  set = (newState) => this.setState(newState);

  componentDidMount() {
    if (this.state.showRight === null && this.secondaryBlockRef) {
      this.setState({ showRight: this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.excludeZero !== this.props.excludeZero ||
      nextProps.showStandards !== this.props.showStandards ||
      nextProps.showDescription !== this.props.showDescription) {
      this.setState({
        currentPosition: 0,
        showLeft: false,
        showRight: this.secondaryBlockRef && this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth
      });
    }
  }

  // Max Points
  updateMaxPointsFieldValue = ({ target }) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { maxPoints, scorePointsLabels, traits } = scale;

    const numberValue = parseInt(target.value, 10);

    this.setState({
      currentPosition: 0,
      showLeft: false,
      showRight: this.secondaryBlockRef && this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth
    });

    if (numberValue < maxPoints) {
      this.showDecreaseMaxPointsModal({ newMaxPoints: numberValue });
    } else {
      for (let i = 0; i <= numberValue; i++) {
        if (!scorePointsLabels[i]) {
          scorePointsLabels.push('');
        }

        traits.forEach((trait, index) => {
          if (!traits[index].scorePointsDescriptors[i]) {
            traits[index].scorePointsDescriptors.push('');
          }
        });

      }

      onScaleChanged(scaleIndex, { maxPoints: numberValue, scorePointsLabels, traits })
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

    const remainingTraits = traits.filter((item, index) => index !== oldIndex);

    const newTraits = [
      ...remainingTraits.slice(0, newIndex),
      cup,
      ...remainingTraits.slice(newIndex),
    ];

    onScaleChanged(scaleIndex, { traits: newTraits });
  }

  decreasePosition = () => {
    const { currentPosition } = this.state;
    const decreasedPosition = currentPosition - (currentPosition === AdjustedBlockWidth / 2 ? AdjustedBlockWidth / 2 : AdjustedBlockWidth);

    this.setState({
      currentPosition: decreasedPosition,
      showRight: decreasedPosition < this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
      showLeft: decreasedPosition > 0
    });
  }

  increasePosition = () => {
    const { currentPosition } = this.state;
    const increasedPosition = currentPosition + (currentPosition === 0 ? AdjustedBlockWidth / 2 : AdjustedBlockWidth);

    this.setState({
      currentPosition: increasedPosition,
      showRight: increasedPosition < this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
      showLeft: increasedPosition > 0
    });
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
      showLevelTagInput,
      showScorePointLabels,
      enableDragAndDrop
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
      showDeleteTraitDialog,
      currentPosition,
      showRight,
      showLeft
    } = this.state;

    const scorePointsValues = [];

    // determining the score points values
    for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue -= 1) {
      scorePointsValues.push(pointValue);
    }


    return (
      <div
        key={`scale-${scaleIndex}`}
        className={classes.scaleWrapper}
        ref={ref => {
          this.scaleWrapper = ref;
        }}
      >
        <TraitsHeader
          setSecondaryBlockRef={ref => {
            if (ref) {
              this.secondaryBlockRef = ref;
            }
          }}
          key={'header-key'}
          traitLabel={traitLabel}
          scorePointsValues={scorePointsValues}
          scorePointsLabels={scorePointsLabels}
          onScaleChange={(params) => onScaleChanged(scaleIndex, params)}
          onTraitLabelChange={label => onScaleChanged(scaleIndex, { traitLabel: label })}
          showStandards={showStandards}
          showDescription={showDescription}
          showLevelTagInput={showLevelTagInput}
          showScorePointLabels={showScorePointLabels}
          maxPoints={maxPoints}
          updateMaxPointsFieldValue={this.updateMaxPointsFieldValue}
          scaleIndex={scaleIndex}
          showDeleteScaleModal={this.showDeleteScaleModal}
          currentPosition={currentPosition}
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
            currentPosition={currentPosition}
            enableDragAndDrop={enableDragAndDrop}
          />
        ))}

        <Arrow
          width={`${AdjustedBlockWidth / 2}px`}
          show={showLeft}
          onClick={this.decreasePosition}
          left={`${PrimaryBlockWidth + DragHandleSpace}px`}
          showLevelTagInput={showLevelTagInput}
        >
          <ArrowBackIosIcon/>
        </Arrow>
        <Arrow
          width={`${AdjustedBlockWidth / 2}px`}
          show={showRight}
          onClick={this.increasePosition}
          showLevelTagInput={showLevelTagInput}
        >
          <ArrowForwardIosIcon/>
        </Arrow>

        <MultiTraitButton onClick={this.onTraitAdded}>
          <div dangerouslySetInnerHTML={{ __html: `Add ${traitLabel || ' Trait'}` }}/>
        </MultiTraitButton>

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
  showScorePointLabels: PropTypes.bool,
  enableDragAndDrop: PropTypes.bool,
}

export default withDragContext(withStyles(styles)(Scale));
