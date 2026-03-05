import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { color } from '@pie-lib/render-ui';

import {
  Block,
  BlockWidth,
  PrimaryBlockWidth,
  SecondaryBlock,
  ScorePoint,
  MaxPointsPicker,
  SimpleInput,
  ScaleSettings,
  HeaderHeight,
  HeaderHeightLarge,
} from './common';

const Label = styled('div')({
  width: '140px',
  border: 'none',
  padding: '10px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});

const GreyHeaderRow = styled('div')(({ height, theme }) => ({
  background: color.secondaryBackground(),
  borderRadius: '4px',
  position: 'relative',
  marginBottom: theme.spacing(2),
  display: 'flex',
  height: height,
}));

const PrimaryBlockGreyHeader = styled('div')(({ theme }) => ({
  width: `${PrimaryBlockWidth}px`,
  minWidth: `${PrimaryBlockWidth}px`,
  position: 'relative',
  padding: '0 10px',
  boxSizing: 'border-box',
  paddingTop: theme.spacing(1.5),
  alignSelf: 'center'
}));

const ScorePointErrorText = styled('div')(({ theme }) => ({
  position: 'absolute',
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(0.5),
}));

export class TraitsHeaderTile extends React.Component {
  static propTypes = {
    maxPointsEnabled: PropTypes.bool,
    spellCheck: PropTypes.bool,
    errors: PropTypes.object,
  };

  state = {
    anchorEl: null,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentPosition !== this.props.currentPosition) {
      this.scrollToPosition(nextProps.currentPosition);
    }
  }

  onScorePointLabelChange = ({ scorePointLabel, value }) => {
    const { scorePointsLabels, onScaleChange } = this.props;

    if (value < 0 || value >= scorePointsLabels.length) return;

    scorePointsLabels[value] = scorePointLabel;

    onScaleChange({ scorePointsLabels });
  };

  handleClick = (event) => this.setState({ anchorEl: event.currentTarget });

  handleClose = () => this.setState({ anchorEl: null });

  scrollToPosition = (position) => this.secondaryBlock.scrollTo({ left: position });

  openMenu = () => {
    this.props.showDeleteScaleModal();
    this.handleClose();
  };

  render() {
    const {
      scorePointsValues,
      scorePointsLabels,
      traitLabel,
      currentPosition,
      showStandards,
      onTraitLabelChange,
      showDescription,
      showLevelTagInput,
      maxPoints,
      updateMaxPointsFieldValue,
      scaleIndex,
      showScorePointLabels,
      secondaryBlockWidth,
      setSecondaryBlockRef,
      spellCheck,
      uploadSoundSupport,
      maxPointsEnabled,
      mathMlOptions = {},
      errors = {},
      maxMaxPoints,
      labelPluginProps = {},
      imageSupport = {},
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <GreyHeaderRow height={showLevelTagInput ? HeaderHeightLarge : HeaderHeight}>
        <PrimaryBlockGreyHeader>
          {showLevelTagInput && (
            <SimpleInput
              markup={traitLabel || 'Trait'}
              onChange={onTraitLabelChange}
              pluginProps={labelPluginProps}
              spellCheck={spellCheck}
              label="Level Label"
              uploadSoundSupport={uploadSoundSupport}
              mathMlOptions={mathMlOptions}
              imageSupport={imageSupport}
            />
          )}

          <ScaleSettings>
            <div>Scale {scaleIndex + 1}</div>

            {maxPointsEnabled && (
              <MaxPointsPicker maxPoints={maxPoints} maxMaxPoints={maxMaxPoints} onChange={updateMaxPointsFieldValue} />
            )}

            <div>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={this.handleClick}
                size="large">
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={this.handleClose}
                transitionDuration={{ enter: 225, exit: 195 }}
              >
                {['Remove Scale'].map((option) => (
                  <MenuItem key={option} onClick={this.openMenu}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </ScaleSettings>
        </PrimaryBlockGreyHeader>
        <SecondaryBlock
          setRef={(ref) => {
            if (ref) {
              this.secondaryBlock = ref;
              setSecondaryBlockRef(ref);
            }
          }}
          width={`${secondaryBlockWidth}px`}
        >
          {showStandards && (
            <Block>
              <Label>Standard(s)</Label>
            </Block>
          )}

          {showDescription && (
            <Block>
              <Label>Description</Label>
            </Block>
          )}

          {scorePointsValues.map((scorePointsValue, index) => {
            const adjustedBlockWidth = BlockWidth + 2 * 8; // 8 is padding
            const remainingSpace = secondaryBlockWidth - adjustedBlockWidth * index + currentPosition - 128;
            const value = scorePointsValues.length - index - 1;
            let scoreDescriptor;
            let error;

            try {
              scoreDescriptor = scorePointsLabels[value] || '';
              error = errors[value] || '';
            } catch (e) {
              scoreDescriptor = '';
            }

            return (
              <Block key={`secondary-block-part-${index}`}>
                <ScorePoint
                  scorePointsValue={scorePointsValue}
                  error={error}
                  scoreDescriptor={scoreDescriptor}
                  pluginProps={labelPluginProps}
                  showScorePointLabels={showScorePointLabels}
                  onChange={(scorePointLabel) => this.onScorePointLabelChange({ scorePointLabel, value })}
                  alignToRight={remainingSpace < 296 && scorePointsValue < maxPoints} // 296 is the space required for the toolbar
                  spellCheck={spellCheck}
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  imageSupport={imageSupport}
                />
                {error && <ScorePointErrorText>{error}</ScorePointErrorText>}
              </Block>
            );
          })}
        </SecondaryBlock>
      </GreyHeaderRow>
    );
  }
}

TraitsHeaderTile.propTypes = {
  onTraitLabelChange: PropTypes.func,
  onScaleChange: PropTypes.func,
  scorePointsValues: PropTypes.arrayOf(PropTypes.number),
  scorePointsLabels: PropTypes.arrayOf(PropTypes.string),
  traitLabel: PropTypes.string,
  showStandards: PropTypes.bool,
  showLevelTagInput: PropTypes.bool,
  showDescription: PropTypes.bool,
  maxPoints: PropTypes.number,
  updateMaxPointsFieldValue: PropTypes.func,
  scaleIndex: PropTypes.number,
  currentPosition: PropTypes.number,
  secondaryBlockWidth: PropTypes.number,
  showDeleteScaleModal: PropTypes.func,
  showScorePointLabels: PropTypes.bool,
  setSecondaryBlockRef: PropTypes.func,
  uploadSoundSupport: PropTypes.object,
  maxMaxPoints: PropTypes.number,
  labelPluginProps: PropTypes.object,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
};

export default TraitsHeaderTile;
