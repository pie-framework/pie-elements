import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useDraggable, useDroppable } from '@dnd-kit/core';

import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

import { Block, BlockWidth, ExpandedInput, PrimaryBlock, Row, SecondaryBlock, UnderlinedInput } from './common';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const log = debug('@pie-element:placement-ordering:configure:trait-tile');

const ActionsIcon = styled(DragIndicatorIcon)({
  color: color.text(),
});

const StyledPrimaryBlock = styled(PrimaryBlock)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(5),
}));

const Controls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  cursor: 'pointer',
});

const Options = styled(IconButton)({
  marginLeft: 'auto',
});

const RemoveLabel = styled('div')({
  display: 'flex',
  whiteSpace: 'break-spaces',
});

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingBottom: theme.spacing(1),
}));

function TraitTile({
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
  imageSupport = {},
  index,
  onTraitChanged,
  onTraitRemoved,
  onTraitDropped,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const secondaryBlockRef = React.useRef(null);

  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: `trait-${index}`,
    data: {
      type: 'trait',
      index,
      name,
    },
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `trait-drop-${index}`,
    data: {
      type: 'trait',
      index,
    },
  });

  React.useEffect(() => {
    if (currentPosition !== undefined && secondaryBlockRef.current && secondaryBlockRef.current.scrollLeft !== currentPosition) {
      scrollToPosition(currentPosition);
    }
  }, [currentPosition]);

  const onTraitChangedHandler = (params) => {
    if (isEmpty(params)) return;

    const updatedTrait = { ...{ name, standards, description, scorePointsDescriptors }, ...params };
    onTraitChanged(updatedTrait);
  };

  const onScorePointDescriptorChange = ({ descriptor, value }) => {
    if (value < 0 || value >= scorePointsDescriptors.length) return;

    const newDescriptors = [...scorePointsDescriptors];
    newDescriptors[value] = descriptor;

    onTraitChangedHandler({ scorePointsDescriptors: newDescriptors });
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const scrollToPosition = (position) => secondaryBlockRef.current?.scrollTo({ left: position });

  const openMenu = () => {
    onTraitRemoved();
    handleClose();
  };

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : {};

  return (
    <div ref={setDropRef} style={dragStyle}>
      <Row>
        <StyledPrimaryBlock>
          <Controls>
            {enableDragAndDrop && (
              <span ref={setDragRef} {...attributes} {...listeners}>
                <ActionsIcon />
              </span>
            )}

            <Options
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
              size="large">
              <MoreVertIcon />
            </Options>

            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={handleClose}
              transitionDuration={{ enter: 225, exit: 195 }}
            >
              <MenuItem onClick={openMenu}>
                <RemoveLabel
                  dangerouslySetInnerHTML={{ __html: `Remove ${name || traitLabel}` }}
                />
              </MenuItem>
            </Menu>
          </Controls>

          <UnderlinedInput
            markup={name}
            error={error?.name || ''}
            onChange={(name) => onTraitChangedHandler({ name })}
            pluginProps={labelPluginProps}
            placeholder={`Enter ${traitLabel}`}
            spellCheck={spellCheck}
            uploadSoundSupport={uploadSoundSupport}
            mathMlOptions={mathMlOptions}
            imageSupport={imageSupport}
          />
          {error && <ErrorText>{error.name || ''}</ErrorText>}
        </StyledPrimaryBlock>

        <SecondaryBlock
          setRef={(ref) => {
            secondaryBlockRef.current = ref;
          }}
          width={`${secondaryBlockWidth}px`}
        >
          {showStandards && standards && (
            <Block>
              <ExpandedInput
                placeholder="Standards"
                markup={standards.join(',')}
                onChange={(standards) => onTraitChangedHandler({ standards: standards.split(',') })}
                pluginProps={expandedPluginProps}
                spellCheck={spellCheck}
                uploadSoundSupport={uploadSoundSupport}
                mathMlOptions={mathMlOptions}
                imageSupport={imageSupport}
              />
            </Block>
          )}

          {showDescription && (
            <Block>
              <ExpandedInput
                placeholder="Enter Description"
                markup={description}
                error={error?.description || ''}
                onChange={(description) => onTraitChangedHandler({ description })}
                pluginProps={expandedPluginProps}
                spellCheck={spellCheck}
                uploadSoundSupport={uploadSoundSupport}
                mathMlOptions={mathMlOptions}
                imageSupport={imageSupport}
              />
              {error && <ErrorText>{error.description || ''}</ErrorText>}
            </Block>
          )}

          {(scorePointsValues || []).map((scorePointsValue, scoreIndex) => {
            const adjustedBlockWidth = BlockWidth + 2 * 8; // 8 is padding
            const remainingSpace = secondaryBlockWidth - adjustedBlockWidth * scoreIndex + currentPosition - 98;
            const value = scorePointsValues.length - scoreIndex - 1;
            let scoreDescriptor;

            try {
              scoreDescriptor = scorePointsDescriptors[value] || '';
            } catch (e) {
              scoreDescriptor = '';
            }

            return (
              <Block key={`key-key-${scoreIndex}`}>
                <ExpandedInput
                  placeholder="Enter Descriptor"
                  markup={scoreDescriptor}
                  onChange={(descriptor) => onScorePointDescriptorChange({ descriptor, value })}
                  pluginProps={expandedPluginProps}
                  alignToRight={remainingSpace < 296 && scorePointsValue < maxPoints} // 296 is the space required for the toolbar
                  spellCheck={spellCheck}
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  imageSupport={imageSupport}
                />
              </Block>
            );
          })}
        </SecondaryBlock>
      </Row>
    </div>
  );
}

TraitTile.propTypes = {
  error: PropTypes.object,
  index: PropTypes.number.isRequired,
  onTraitChanged: PropTypes.func.isRequired,
  onTraitRemoved: PropTypes.func.isRequired,
  onTraitDropped: PropTypes.func,
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
  spellCheck: PropTypes.bool,
  uploadSoundSupport: PropTypes.object,
  mathMlOptions: PropTypes.object,
  expandedPluginProps: PropTypes.object,
  labelPluginProps: PropTypes.object,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
};

export default TraitTile;
