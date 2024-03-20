import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { color } from '@pie-lib/pie-toolbox/render-ui';

import {
  Block,
  BlockWidth,
  PrimaryBlock,
  Row,
  SecondaryBlock,
  ScorePoint,
  MaxPointsPicker,
  SimpleInput,
  ScaleSettings,
  HeaderHeight,
  HeaderHeightLarge,
} from './common';

const styles = (theme) => ({
  label: {
    textAlign: 'center',
    width: '140px',
    border: 'none',
    margin: theme.spacing.unit,
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  greyHeader: {
    background: color.secondaryBackground(),
    borderRadius: '4px',
    position: 'relative',
    marginBottom: theme.spacing.unit * 2,
  },
  primaryBlockGreyHeader: {
    paddingTop: theme.spacing.unit * 1.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit / 2,
  },
});

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
      classes,
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
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <Row className={classes.greyHeader} height={showLevelTagInput ? HeaderHeightLarge : HeaderHeight}>
        <PrimaryBlock className={classes.primaryBlockGreyHeader}>
          {showLevelTagInput && (
            <SimpleInput
              markup={traitLabel || 'Trait'}
              onChange={onTraitLabelChange}
              pluginProps={labelPluginProps}
              spellCheck={spellCheck}
              label="Level Label"
              uploadSoundSupport={uploadSoundSupport}
              mathMlOptions={mathMlOptions}
            />
          )}

          <ScaleSettings>
            <div>Scale {scaleIndex + 1}</div>

            {maxPointsEnabled && (
              <MaxPointsPicker maxPoints={maxPoints} maxMaxPoints={maxMaxPoints} onChange={updateMaxPointsFieldValue} />
            )}

            <div>
              <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={this.handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={this.handleClose}>
                {['Remove Scale'].map((option) => (
                  <MenuItem key={option} onClick={this.openMenu}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </ScaleSettings>
        </PrimaryBlock>

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
              <div className={classes.label}>Standard(s)</div>
            </Block>
          )}

          {showDescription && (
            <Block>
              <div className={classes.label}>Description</div>
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
                />
                {error && <div className={classes.errorText}>{error}</div>}
              </Block>
            );
          })}
        </SecondaryBlock>
      </Row>
    );
  }
}

TraitsHeaderTile.propTypes = {
  classes: PropTypes.object.isRequired,
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
};

export default withStyles(styles)(TraitsHeaderTile);
