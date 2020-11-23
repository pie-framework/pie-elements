import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';

import DragHandle from '@material-ui/icons/DragHandle';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { withStyles } from '@material-ui/core/styles';

import EditableHtml from '@pie-lib/editable-html';

const log = debug('@pie-element:placement-ordering:configure:trait-tile');

const styles = theme => ({
  actions: {
    color: '#B1B1B1'
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  prompt: {
    width: '80%',
    border: 'none',
    margin: '8px'
  },
  removeCircle: {
    fill: theme.palette.error[500]
  },
  traitTile: {
    cursor: 'move',
    backgroundColor: '#fafafa',
    borderRadius: '4px',
    marginTop: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'flex-start'
  },
  targetPrompt: {
    backgroundColor: '#D7D7D7'
  }
});

export class TraitTile extends React.Component {
  onTraitChanged = (params) => {
    const { trait, onTraitChanged } = this.props;

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

  render() {
    const {
      classes,
      connectDragSource,
      connectDropTarget,
      isDragging,
      onTraitRemoved,
      trait: {
        name,
        standards,
        description,
        scorePointsDescriptors
      },
      scorePointsValues,
      showStandards
    } = this.props;

    const dragSourceOpts = {};
    const opacity = isDragging ? 0 : 1;
    const pluginProps = {
      image: { disabled: true },
      math: { disabled: true }
    };

    return connectDragSource(
      connectDropTarget(
        <div>
          <div className={classes.traitTile} style={{ opacity: opacity, width: '100%' }}>
            <span className={classNames(classes.dragHandle)}>
              <DragHandle className={classes.actions}/>
            </span>

            <EditableHtml
              className={classes.prompt}
              placeholder="Trait name"
              markup={name}
              onChange={name => this.onTraitChanged({ name })}
              pluginProps={pluginProps}
            />

            {showStandards && (
              <EditableHtml
                className={classes.prompt}
                placeholder="Standards"
                markup={standards.join(',')}
                onChange={standards => this.onTraitChanged({ standards: standards.split(',') })}
                pluginProps={pluginProps}
              />
            )}

            <EditableHtml
              className={classes.prompt}
              placeholder="Description"
              markup={description}
              onChange={description => this.onTraitChanged({ description })}
              pluginProps={pluginProps}
            />

            {scorePointsValues.map((scorePointsValue, index) => {
              const value = scorePointsValues.length - index - 1;
              let scoreDescriptor;

              try {
                scoreDescriptor = scorePointsDescriptors[value] || '';
              } catch (e) {
                scoreDescriptor = '';
              }

              return (
                <EditableHtml
                  key={`score-point-descriptor-${index}`}
                  className={classes.prompt}
                  placeholder='Descriptor'
                  markup={scoreDescriptor}
                  onChange={descriptor => this.onScorePointDescriptorChange({ descriptor, value })}
                  pluginProps={pluginProps}
                />
              )
            })}

            <div className={classes.controls}>
              <IconButton color='default' onClick={onTraitRemoved}>
                <RemoveCircle classes={{ root: classes.removeCircle }}/>
              </IconButton>
            </div>
          </div>
        </div>
      ),
      dragSourceOpts
    );
  }
}

TraitTile.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
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
  showStandards: PropTypes.bool
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
