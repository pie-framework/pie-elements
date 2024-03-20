import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { DragSource, DropTarget } from 'react-dnd';

import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/pie-toolbox/render-ui';

import { Block, BlockWidth, ExpandedInput, PrimaryBlock, Row, SecondaryBlock, UnderlinedInput } from './common';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const log = debug('@pie-element:placement-ordering:configure:trait-tile');

const styles = (theme) => ({
  actions: {
    color: color.text(),
  },
  primaryBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 5,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
  },
  options: {
    marginLeft: 'auto',
  },
  dragHandle: {},
  removeLabel: {
    display: 'flex',
    whiteSpace: 'break-spaces',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
});

export class TraitTile extends React.Component {
  static propTypes = {
    spellCheck: PropTypes.bool,
    uploadSoundSupport: PropTypes.object,
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentPosition !== this.props.currentPosition ||
      (this.secondaryBlock && this.secondaryBlock.scrollLeft !== nextProps.currentPosition)
    ) {
      this.scrollToPosition(nextProps.currentPosition);
    }
  }

  onTraitChanged = (params) => {
    const { trait, onTraitChanged } = this.props;

    if (isEmpty(params)) return;

    Object.keys(params).forEach((key) => {
      trait[key] = params[key];
    });

    onTraitChanged(trait);
  };

  onScorePointDescriptorChange = ({ descriptor, value }) => {
    const {
      trait: { scorePointsDescriptors },
    } = this.props;

    if (value < 0 || value >= scorePointsDescriptors.length) return;

    scorePointsDescriptors[value] = descriptor;

    this.onTraitChanged({ scorePointsDescriptors });
  };

  handleClick = (event) => this.setState({ anchorEl: event.currentTarget });

  handleClose = () => this.setState({ anchorEl: null });

  scrollToPosition = (position) => this.secondaryBlock.scrollTo({ left: position });

  openMenu = () => {
    this.props.onTraitRemoved();
    this.handleClose();
  };

  render() {
    const {
      classes,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      error,
      trait: { name, standards, description, scorePointsDescriptors },
      traitLabel,
      scorePointsValues,
      showStandards,
      showDescription,
      enableDragAndDrop,
      currentPosition,
      secondaryBlockWidth,
      spellCheck,
      maxPoints,
      uploadSoundSupport,
      mathMlOptions = {},
      expandedPluginProps = {},
      labelPluginProps = {},
    } = this.props;
    const { anchorEl } = this.state;

    return connectDragPreview(
      connectDropTarget(
        <div>
          <Row>
            <PrimaryBlock className={classes.primaryBlock}>
              <div className={classes.controls}>
                {enableDragAndDrop
                  ? connectDragSource(
                      <span className={classes.dragHandle}>
                        <DragIndicatorIcon className={classes.actions} />
                      </span>,
                    )
                  : null}

                <IconButton
                  className={classes.options}
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVertIcon />
                </IconButton>

                <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={this.handleClose}>
                  <MenuItem onClick={this.openMenu}>
                    <div
                      className={classes.removeLabel}
                      dangerouslySetInnerHTML={{ __html: `Remove ${name || traitLabel}` }}
                    />
                  </MenuItem>
                </Menu>
              </div>

              <UnderlinedInput
                markup={name}
                error={error?.name || ''}
                onChange={(name) => this.onTraitChanged({ name })}
                pluginProps={labelPluginProps}
                placeholder={`Enter ${traitLabel}`}
                spellCheck={spellCheck}
                uploadSoundSupport={uploadSoundSupport}
                mathMlOptions={mathMlOptions}
              />
              {error && <div className={classes.errorText}>{error.name || ''}</div>}
            </PrimaryBlock>

            <SecondaryBlock
              setRef={(ref) => {
                this.secondaryBlock = ref;
              }}
              width={`${secondaryBlockWidth}px`}
            >
              {showStandards && standards && (
                <Block>
                  <ExpandedInput
                    placeholder="Standards"
                    markup={standards.join(',')}
                    onChange={(standards) => this.onTraitChanged({ standards: standards.split(',') })}
                    pluginProps={expandedPluginProps}
                    spellCheck={spellCheck}
                    uploadSoundSupport={uploadSoundSupport}
                    mathMlOptions={mathMlOptions}
                  />
                </Block>
              )}

              {showDescription && (
                <Block>
                  <ExpandedInput
                    placeholder="Enter Description"
                    markup={description}
                    error={error?.description || ''}
                    onChange={(description) => this.onTraitChanged({ description })}
                    pluginProps={expandedPluginProps}
                    spellCheck={spellCheck}
                    uploadSoundSupport={uploadSoundSupport}
                    mathMlOptions={mathMlOptions}
                  />
                  {error && <div className={classes.errorText}>{error.description || ''}</div>}
                </Block>
              )}

              {(scorePointsValues || []).map((scorePointsValue, index) => {
                const adjustedBlockWidth = BlockWidth + 2 * 8; // 8 is padding
                const remainingSpace = secondaryBlockWidth - adjustedBlockWidth * index + currentPosition - 98;
                const value = scorePointsValues.length - index - 1;
                let scoreDescriptor;

                try {
                  scoreDescriptor = scorePointsDescriptors[value] || '';
                } catch (e) {
                  scoreDescriptor = '';
                }

                return (
                  <Block key={`key-key-${index}`}>
                    <ExpandedInput
                      placeholder="Enter Descriptor"
                      markup={scoreDescriptor}
                      onChange={(descriptor) => this.onScorePointDescriptorChange({ descriptor, value })}
                      pluginProps={expandedPluginProps}
                      alignToRight={remainingSpace < 296 && scorePointsValue < maxPoints} // 296 is the space required for the toolbar
                      spellCheck={spellCheck}
                      uploadSoundSupport={uploadSoundSupport}
                      mathMlOptions={mathMlOptions}
                    />
                  </Block>
                );
              })}
            </SecondaryBlock>
          </Row>
        </div>,
      ),
    );
  }
}

TraitTile.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  error: PropTypes.object,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any,
  isOver: PropTypes.bool,
  index: PropTypes.number,
  onTraitChanged: PropTypes.func.isRequired,
  onTraitRemoved: PropTypes.func.isRequired,
  trait: PropTypes.shape({
    name: PropTypes.string,
    standards: PropTypes.arrayOf(PropTypes.string),
    scorePointsDescriptors: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }),
  traitLabel: PropTypes.string,
  scorePointsValues: PropTypes.arrayOf(PropTypes.number),
  showStandards: PropTypes.bool,
  showDescription: PropTypes.bool,
  maxPoints: PropTypes.number,
  enableDragAndDrop: PropTypes.bool,
  currentPosition: PropTypes.number,
  secondaryBlockWidth: PropTypes.number,
  expandedPluginProps: PropTypes.object,
  labelPluginProps: PropTypes.object,
};

export const StyledTrait = withStyles(styles)(TraitTile);

const NAME = 'trait-config';

const traitSource = {
  beginDrag(props) {
    return {
      name: props.trait.name,
      index: props.index,
    };
  },
};

const StyledSource = DragSource(NAME, traitSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(StyledTrait);

const traitTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());

    props.onTraitDropped(item, props.index);
  },
};

const StyledSourceAndTarget = DropTarget(NAME, traitTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(StyledSource);

export default StyledSourceAndTarget;
