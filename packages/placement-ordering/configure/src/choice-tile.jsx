import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html';
import CardActions from '@material-ui/core/CardActions';
import DragHandle from '@material-ui/icons/DragHandle';

import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

const log = debug('@pie-element:placement-ordering:configure:choice-tile');

export class ChoiceTile extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any,
    maxImageHeight: PropTypes.object,
    maxImageWidth: PropTypes.object,
    label: PropTypes.string,
    isOver: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    type: PropTypes.string,
    empty: PropTypes.bool,
    disabled: PropTypes.bool,
    outcome: PropTypes.object,
    index: PropTypes.number,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    choice: PropTypes.object,
    choices: PropTypes.array.isRequired,
    onChoiceChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disableImages: PropTypes.bool,
    toolbarOpts: PropTypes.object,
    choicesLabel: PropTypes.string,
    error: PropTypes.string,
    spellCheck: PropTypes.bool,
  };

  onLabelChange = (label) => {
    const { choice, onChoiceChange } = this.props;

    choice.label = label;
    onChoiceChange(choice);
  };

  render() {
    const {
      choice: { label, editable, type },
      isDragging,
      connectDragSource,
      connectDropTarget,
      classes,
      onDelete,
      imageSupport,
      disableImages,
      spellCheck,
      toolbarOpts,
      maxImageWidth,
      maxImageHeight,
      error,
      mathMlOptions
    } = this.props;

    const dragSourceOpts = {}; //dropEffect: moveOnDrag ? 'move' : 'copy'};

    const choicePlugins = {
      image: { disabled: disableImages },
      audio: { disabled: true },
      video: { disabled: true },
    };
    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'bulleted-list' && p !== 'numbered-list',
    );

    const opacity = isDragging ? 0 : 1;
    const markup = (
      <div className={classes.choiceTile} style={{ opacity: opacity, width: '100%' }}>
        <div style={{ width: '100%', display: 'flex' }}>
          <CardActions>
            <span className={classNames(classes.dragHandle)}>
              <DragHandle className={classes.actions} />
            </span>
          </CardActions>

          <EditableHtml
            disabled={!editable}
            className={classNames(classes.prompt, !editable && classes.targetPrompt)}
            placeholder={type !== 'target' && !label.includes('data-latex') ? 'Enter a choice' : ''}
            markup={label}
            imageSupport={imageSupport || undefined}
            onChange={this.onLabelChange}
            pluginProps={choicePlugins}
            toolbarOpts={toolbarOpts}
            activePlugins={filteredDefaultPlugins}
            spellCheck={spellCheck}
            maxImageWidth={maxImageWidth}
            maxImageHeight={maxImageHeight}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            error={editable && error}
            mathMlOptions={mathMlOptions}
          />

          {editable && (
            <div className={classes.controls}>
              <IconButton color="default" onClick={onDelete}>
                <RemoveCircle classes={{ root: classes.removeCircle }} />
              </IconButton>
            </div>
          )}
        </div>

        {editable && error && <div className={classes.errorText}>{error}</div>}
      </div>
    );

    return connectDragSource(connectDropTarget(<div>{markup}</div>), dragSourceOpts);
  }
}

const Styled = withStyles((theme) => ({
  removeCircle: {
    fill: theme.palette.error[500],
  },
  choiceTile: {
    cursor: 'move',
    backgroundColor: theme.palette.common.white,
    margin: `${theme.spacing.unit}px 0`,
    display: 'flex',
    flexDirection: 'column',
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  prompt: {
    width: '80%',
    border: 'none',
    borderRadius: '4px',
  },
  targetPrompt: {
    backgroundColor: theme.palette.error['A100'],
  },
  actions: {
    color: theme.palette.error[400],
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    marginLeft: theme.spacing.unit * 5,
    marginTop: theme.spacing.unit,
  },
  correctOrder: {
    position: 'absolute',
    top: 0,
    fontSize: theme.typography.fontSize - 2,
    color: color.disabled(),
  },
}))(ChoiceTile);

const NAME = 'choice-config';

const choiceSource = {
  beginDrag(props) {
    return {
      id: props.choice.id,
      index: props.index,
      type: props.choice.type,
      instanceId: props.choice.instanceId,
    };
  },
};

const StyledSource = DragSource(NAME, choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Styled);

const choiceTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());

    props.onDropChoice(item, props.index);
  },
};

const StyledSourceAndTarget = DropTarget(NAME, choiceTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(StyledSource);

export default StyledSourceAndTarget;
