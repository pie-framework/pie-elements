import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { DragSource, DropTarget } from 'react-dnd';

import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

import {
  Block,
  BlockWidth,
  DragHandleSpace,
  ExpandedInput,
  PrimaryBlock,
  Row,
  SecondaryBlock,
  UnderlinedInput
} from './common';
import { labelPlugins } from './utils';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const log = debug('@pie-element:placement-ordering:configure:trait-tile');

const styles = {
  actions: {
    color: color.text()
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: '28px',
    right: '8px',
    cursor: 'pointer',
  },
  dragHandle: {
    position: 'absolute',
    top: '80px',
    left: `-${DragHandleSpace}px`,
    cursor: 'move'
  }
};

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');
  div.innerHTML = (htmlString || '').trim();

  return div;
};

export class TraitTile extends React.Component {
  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentPosition !== this.props.currentPosition || (this.secondaryBlock && this.secondaryBlock.scrollLeft !== nextProps.currentPosition)) {
      this.scrollToPosition(nextProps.currentPosition);
    }
  }

  onTraitChanged = (params) => {
    const { trait, onTraitChanged } = this.props;

    if (isEmpty(params)) return;

    Object.keys(params).forEach(key => {
      trait[key] = params[key];
    });

    onTraitChanged(trait);
  };

  onScorePointDescriptorChange = ({ descriptor, value }) => {
    const { trait: { scorePointsDescriptors } } = this.props;

    if (value < 0 || value >= scorePointsDescriptors.length) return;

    scorePointsDescriptors[value] = descriptor;

    this.onTraitChanged({ scorePointsDescriptors });
  };

  handleClick = (event) => this.setState({ anchorEl: event.currentTarget });

  handleClose = () => this.setState({ anchorEl: null });

  scrollToPosition = position => this.secondaryBlock.scrollTo({ left: position });

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
      trait: {
        name,
        standards,
        description,
        scorePointsDescriptors
      },
      scorePointsValues,
      showStandards,
      showDescription,
      enableDragAndDrop,
      currentPosition,
      secondaryBlockWidth
    } = this.props;
    const { anchorEl } = this.state;

    const pluginProps = {
      image: { disabled: true },
      math: { disabled: true }
    };

    const onlyText = createElementFromHTML(name).textContent;
    const traitName = isEmpty(onlyText) ? name : onlyText;

    return (
      connectDragPreview(
        connectDropTarget(
          <div>
            <Row>
              <PrimaryBlock>
                {enableDragAndDrop ?
                  connectDragSource(
                    <span className={classes.dragHandle}>
                    <DragIndicatorIcon className={classes.actions}/>
                  </span>) : null
              }
              <div className={classes.controls}>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVertIcon/>
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={!!anchorEl}
                  onClose={this.handleClose}
                >
                  {[`Remove ${traitName}`].map((option) => (
                    <MenuItem
                      key={option}
                      onClick={this.openMenu}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>

              <UnderlinedInput
                markup={name}
                onChange={name => this.onTraitChanged({ name })}
                pluginProps={labelPlugins}
                placeholder='Enter Trait'
              />
            </PrimaryBlock>
            <SecondaryBlock
              setRef={ref => {
                this.secondaryBlock = ref;
              }}
              width={`${secondaryBlockWidth}px`}
            >
              {showStandards && standards && (
                <Block>
                  <ExpandedInput
                    placeholder="Standards"
                    markup={standards.join(',')}
                    onChange={standards => this.onTraitChanged({ standards: standards.split(',') })}
                    pluginProps={pluginProps}
                  />
                </Block>
              )}

                {showDescription && (
                  <Block>
                    <ExpandedInput
                      placeholder="Description"
                      markup={description}
                      onChange={description => this.onTraitChanged({ description })}
                      pluginProps={pluginProps}
                    />
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
                        placeholder='Enter Description Here'
                        markup={scoreDescriptor}
                        onChange={descriptor => this.onScorePointDescriptorChange({ descriptor, value })}
                        pluginProps={pluginProps}
                        alignToRight={remainingSpace < 296} // 296 is the space required for the toolbar
                      />
                    </Block>
                  )
                })}
              </SecondaryBlock>
            </Row>
          </div>
        ))
    );
  }
}

TraitTile.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
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
  scorePointsValues: PropTypes.arrayOf(PropTypes.number),
  showStandards: PropTypes.bool,
  showDescription: PropTypes.bool,
  enableDragAndDrop: PropTypes.bool,
  currentPosition: PropTypes.number,
  secondaryBlockWidth: PropTypes.number,
};

export const StyledTrait = withStyles(styles)(TraitTile);

const NAME = 'trait-config';

const traitSource = {
  beginDrag(props) {
    return {
      name: props.trait.name,
      index: props.index
    };
  }
};

const StyledSource = DragSource(
  NAME,
  traitSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(StyledTrait);

const traitTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());

    props.onTraitDropped(item, props.index);
  }
};

const StyledSourceAndTarget = DropTarget(
  NAME,
  traitTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
)(StyledSource);

export default StyledSourceAndTarget;
