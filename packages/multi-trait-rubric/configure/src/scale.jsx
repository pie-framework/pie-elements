import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { DragProvider } from '@pie-lib/drag';

import TraitsHeader from './traitsHeader';
import TraitTile from './trait';
import { Arrow, BlockWidth, DragHandleSpace, MultiTraitButton, PrimaryBlockWidth } from './common';
import { DecreaseMaxPoints, DeleteScale, DeleteTrait, InfoDialog } from './modals';

const AdjustedBlockWidth = BlockWidth + 2 * 8; // 8 is padding

const ScaleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  wordBreak: 'break-word',
  position: 'relative',
  marginBottom: theme.spacing(2.5),
}));

export class Scale extends React.Component {
  state = {
    showDecreaseMaxPointsDialog: false,
    showDeleteScaleDialog: false,
    showDeleteTraitDialog: false,
    currentPosition: 0,
    showRight: null,
    showLeft: null,
    showInfoDialog: false,
    infoDialogText: '',
  };

  set = (newState) => this.setState(newState);

  componentDidMount() {
    if (this.state.showRight === null && this.secondaryBlockRef) {
      this.setState({ showRight: this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.scale.maxPoints !== this.props.scale.maxPoints ||
      prevProps.showDescription !== this.props.showDescription ||
      prevProps.excludeZero !== this.props.excludeZero
    ) {
      this.setState({ showRight: this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.excludeZero !== this.props.excludeZero ||
      nextProps.showStandards !== this.props.showStandards ||
      nextProps.showDescription !== this.props.showDescription
    ) {
      this.setState({
        currentPosition: 0,
        showLeft: false,
        showRight: this.secondaryBlockRef && this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
      });
    }
  }

  // Max Points
  updateMaxPointsFieldValue = ({ target }) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { maxPoints } = scale;

    const numberValue = parseInt(target.value, 10);

    this.setState({
      currentPosition: 0,
      showLeft: false,
      showRight: this.secondaryBlockRef && this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
    });

    if (numberValue < maxPoints) {
      this.showDecreaseMaxPointsModal({ newMaxPoints: numberValue });
    } else {
      onScaleChanged(scaleIndex, { maxPoints: numberValue });
    }
  };

  showDecreaseMaxPointsModal = ({ newMaxPoints }) => this.set({ showDecreaseMaxPointsDialog: true, newMaxPoints });

  hideDecreaseMaxPointsModal = () => this.set({ showDecreaseMaxPointsDialog: false, newMaxPoints: undefined });

  changeMaxPoints = () => {
    const { newMaxPoints } = this.state || {};
    const { scaleIndex, onScaleChanged } = this.props || {};

    if (newMaxPoints) {
      onScaleChanged(scaleIndex, { maxPoints: newMaxPoints });
    }

    this.hideDecreaseMaxPointsModal();
  };

  // Delete Scale
  showDeleteScaleModal = () => this.set({ showDeleteScaleDialog: true });

  hideDeleteScaleModal = () => this.set({ showDeleteScaleDialog: false });

  deleteScale = () => {
    const { scaleIndex, onScaleRemoved } = this.props || {};

    this.hideDeleteScaleModal();

    onScaleRemoved(scaleIndex);
  };

  // Delete Trait
  showDeleteTraitModal = (traitToDeleteIndex) => this.set({ showDeleteTraitDialog: true, traitToDeleteIndex });

  hideDeleteTraitModal = () => this.set({ showDeleteTraitDialog: false, traitToDeleteIndex: undefined });

  onTraitRemoved = () => {
    const { traitToDeleteIndex } = this.state;
    const { scale, scaleIndex, onScaleChanged, minNoOfTraits } = this.props || {};
    let { traits, traitLabel } = scale || {};

    if (traitToDeleteIndex < 0 || traitToDeleteIndex >= traits.length) return;

    if (traits.length === minNoOfTraits) {
      this.set({
        infoDialogText: `There can't be less than ${minNoOfTraits} ${(traitLabel || 'trait').toLowerCase()}s.`,
        showInfoDialog: true,
      });

      return false;
    }

    traits = [...traits.slice(0, traitToDeleteIndex), ...traits.slice(traitToDeleteIndex + 1)];

    onScaleChanged(scaleIndex, { traits });

    this.hideDeleteTraitModal();
  };

  onTraitAdded = () => {
    const { scale, scaleIndex, onScaleChanged, maxNoOfTraits } = this.props || {};
    const { traits, scorePointsLabels } = scale || {};

    if (traits.length === maxNoOfTraits) {
      this.set({
        infoDialogText: `There can't be more than ${maxNoOfTraits} scales.`,
        showInfoDialog: true,
      });

      return false;
    }

    traits.push({
      name: '',
      description: '',
      standards: [],
      scorePointsDescriptors: Array.from({ length: scorePointsLabels.length }, () => ''),
    });

    onScaleChanged(scaleIndex, { traits });
  };

  onTraitChanged = (traitIndex, trait) => {
    const { scale, scaleIndex, onScaleChanged } = this.props || {};
    const { traits } = scale || {};

    if (traitIndex >= 0 && traitIndex < traits.length) {
      traits[traitIndex] = trait;

      onScaleChanged(scaleIndex, { traits });
    }
  };

  onTraitDropped = (event) => {
    const { active, over } = event;
    
    if (!over || !active) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    if (activeData?.type === 'trait' && overData?.type === 'trait') {
      const oldIndex = activeData.index;
      const newIndex = overData.index;
      
      if (oldIndex === newIndex) return;
      
      const { scale, scaleIndex, onScaleChanged } = this.props || {};
      const { traits } = scale || {};
      
      const cup = traits[oldIndex];
      const remainingTraits = traits.filter((item, index) => index !== oldIndex);
      const newTraits = [...remainingTraits.slice(0, newIndex), cup, ...remainingTraits.slice(newIndex)];

      onScaleChanged(scaleIndex, { traits: newTraits });
    }
  };

  decreasePosition = () => {
    const { currentPosition } = this.state;
    const decreasedPosition =
      currentPosition - (currentPosition === AdjustedBlockWidth / 2 ? AdjustedBlockWidth / 2 : AdjustedBlockWidth);

    this.setState({
      currentPosition: decreasedPosition,
      showRight: decreasedPosition < this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
      showLeft: decreasedPosition > 0,
    });
  };

  increasePosition = () => {
    const { currentPosition } = this.state;
    const increasedPosition = currentPosition + (currentPosition === 0 ? AdjustedBlockWidth / 2 : AdjustedBlockWidth);

    this.setState({
      currentPosition: increasedPosition,
      showRight: increasedPosition < this.secondaryBlockRef.scrollWidth - this.secondaryBlockRef.offsetWidth,
      showLeft: increasedPosition > 0,
    });
  };

  render() {
    const {
      errors,
      scale,
      scaleIndex,
      showStandards,
      onScaleChanged,
      excludeZero,
      showDescription,
      showLevelTagInput,
      showScorePointLabels,
      enableDragAndDrop,
      spellCheck,
      width,
      uploadSoundSupport,
      maxPointsEnabled,
      mathMlOptions = {},
      maxMaxPoints,
      expandedPluginProps = {},
      labelPluginProps = {},
      imageSupport = {},
    } = this.props || {};

    const { maxPoints, scorePointsLabels, traitLabel, traits } = scale || {};

    const {
      showDecreaseMaxPointsDialog,
      showDeleteScaleDialog,
      showDeleteTraitDialog,
      currentPosition,
      showRight,
      showLeft,
      showInfoDialog,
      infoDialogText,
    } = this.state;

    const { traitsErrors, scorePointsErrors } = errors || {};
    const currentScaleTraitsErrors = (traitsErrors && traitsErrors[scaleIndex]) || {};
    const currentScalePointsLabelsErrors = (scorePointsErrors && scorePointsErrors[scaleIndex]) || {};

    const scorePointsValues = [];
    const secondaryBlockWidth = parseInt(width) - DragHandleSpace - PrimaryBlockWidth || 320; // 320 is minWidth

    // determining the score points values
    for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue -= 1) {
      scorePointsValues.push(pointValue);
    }

    return (
      <DragProvider onDragEnd={this.onTraitDropped}>
        <ScaleWrapper
          key={`scale-${scaleIndex}`}
          ref={(ref) => {
            this.scaleWrapper = ref;
          }}
        >
        <TraitsHeader
          setSecondaryBlockRef={(ref) => {
            if (ref) {
              this.secondaryBlockRef = ref;
            }
          }}
          key={'header-key'}
          errors={currentScalePointsLabelsErrors}
          traitLabel={traitLabel}
          scorePointsValues={scorePointsValues}
          scorePointsLabels={scorePointsLabels}
          onScaleChange={(params) => onScaleChanged(scaleIndex, params)}
          onTraitLabelChange={(label) => onScaleChanged(scaleIndex, { traitLabel: label })}
          showStandards={showStandards}
          showDescription={showDescription}
          showLevelTagInput={showLevelTagInput}
          showScorePointLabels={showScorePointLabels}
          maxPoints={maxPoints}
          updateMaxPointsFieldValue={this.updateMaxPointsFieldValue}
          scaleIndex={scaleIndex}
          showDeleteScaleModal={this.showDeleteScaleModal}
          currentPosition={currentPosition}
          secondaryBlockWidth={secondaryBlockWidth}
          spellCheck={spellCheck}
          uploadSoundSupport={uploadSoundSupport}
          maxPointsEnabled={maxPointsEnabled}
          mathMlOptions={mathMlOptions}
          maxMaxPoints={maxMaxPoints}
          expandedPluginProps={expandedPluginProps}
          labelPluginProps={labelPluginProps}
          imageSupport={imageSupport}
        />

        {traits.map((trait, index) => (
          <TraitTile
            key={index}
            index={index}
            error={currentScaleTraitsErrors && currentScaleTraitsErrors[index]}
            trait={trait}
            traitLabel={traitLabel || 'Trait'}
            scorePointsValues={scorePointsValues}
            scorePointsLabels={scorePointsLabels}
            onTraitRemoved={() => this.showDeleteTraitModal(index)}
            onTraitChanged={(trait) => this.onTraitChanged(index, trait)}
            showStandards={showStandards}
            showDescription={showDescription}
            maxPoints={maxPoints}
            currentPosition={currentPosition}
            enableDragAndDrop={enableDragAndDrop}
            secondaryBlockWidth={secondaryBlockWidth}
            spellCheck={spellCheck}
            uploadSoundSupport={uploadSoundSupport}
            mathMlOptions={mathMlOptions}
            expandedPluginProps={expandedPluginProps}
            labelPluginProps={labelPluginProps}
            imageSupport={imageSupport}
          />
        ))}

        <Arrow
          width={`${AdjustedBlockWidth / 2}px`}
          show={showLeft}
          onClick={this.decreasePosition}
          left={`${PrimaryBlockWidth}px`}
          showLevelTagInput={showLevelTagInput}
        >
          <ArrowBackIosIcon />
        </Arrow>
        <Arrow
          width={`${AdjustedBlockWidth / 2}px`}
          show={showRight}
          onClick={this.increasePosition}
          showLevelTagInput={showLevelTagInput}
        >
          <ArrowForwardIosIcon />
        </Arrow>

        <MultiTraitButton onClick={this.onTraitAdded}>
          <div dangerouslySetInnerHTML={{ __html: `Add ${traitLabel || ' Trait'}` }} />
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
          traitLabel={traitLabel.toLowerCase()}
        />
        <InfoDialog open={showInfoDialog} text={infoDialogText} onClose={() => this.set({ showInfoDialog: false })} />
        </ScaleWrapper>
      </DragProvider>
    );
  }
}

Scale.propTypes = {
  errors: PropTypes.object,
  scale: PropTypes.shape({
    maxPoints: PropTypes.number,
    scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
    traitLabel: PropTypes.string,
    traits: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        standards: PropTypes.arrayOf(PropTypes.string),
        scorePointsDescriptors: PropTypes.arrayOf(PropTypes.string),
        description: PropTypes.string,
      }),
    ),
  }),
  width: PropTypes.string,
  excludeZero: PropTypes.bool,
  scaleIndex: PropTypes.number,
  onScaleChanged: PropTypes.func,
  onScaleRemoved: PropTypes.func,
  showStandards: PropTypes.bool,
  showLevelTagInput: PropTypes.bool,
  showDescription: PropTypes.bool,
  uploadSoundSupport: PropTypes.object,
  showScorePointLabels: PropTypes.bool,
  enableDragAndDrop: PropTypes.bool,
  expandedPluginProps: PropTypes.object,
  labelPluginProps: PropTypes.object,
};

export default Scale;
