import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { DragSource, DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { uid } from '@pie-lib/pie-toolbox/drag';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import debug from 'debug';

const log = debug('@pie-ui:categorize:choice');

export const ChoiceType = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export class Layout extends React.Component {
  static propTypes = {
    ...ChoiceType,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
  };
  static defaultProps = {};
  render() {
    const { classes, className, content, isDragging, disabled, correct } = this.props;

    const rootNames = classNames(
      correct === true && 'correct',
      correct === false && 'incorrect',
      classes.choice,
      isDragging && classes.dragging,
      disabled && classes.disabled,
      className,
    );
    const cardNames = classNames(classes.card);
    return (
      <div className={rootNames}>
        <Card className={cardNames}>
          <CardContent classes={{ root: classes.cardRoot }} dangerouslySetInnerHTML={{ __html: content }} />
        </Card>
      </div>
    );
  }
}

const styles = (theme) => ({
  choice: {
    direction: 'initial',
    cursor: 'pointer',
    width: '100%',
    '&.correct': {
      border: `solid 2px ${color.correct()}`,
    },
    '&.incorrect': {
      border: `solid 2px ${color.incorrect()}`,
    },
    borderRadius: '6px',
  },
  cardRoot: {
    color: color.text(),
    backgroundColor: color.white(),
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
    borderRadius: '4px',
    border: '1px solid',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: '0.6',
  },
  dragging: {
    cursor: 'move',
  },
  card: {
    color: color.text(),
    backgroundColor: color.background(),
    width: '100%',
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    pointerEvents: 'none',
  },
});

const Styled = withStyles(styles)(Layout);

export class Choice extends React.Component {
  static propTypes = {
    ...ChoiceType,
    extraStyle: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.ref) {
      this.ref.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    }
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.removeEventListener('touchstart', this.handleTouchStart);
    }
  }

  handleTouchStart = (e) => {
    e.preventDefault();
  };

  render() {
    const { connectDragSource, id, content, disabled, isDragging, correct, extraStyle } = this.props;

    return connectDragSource(
        <div
            style={{ margin: '4px', ...extraStyle }}
            ref={(ref) => (this.ref = ref)}
            draggable={!disabled}
        >
          <Styled id={id} content={content} disabled={disabled} correct={correct} isDragging={isDragging} />
        </div>,
    );
  }
}

export const spec = {
  canDrag: (props) => !props.disabled,
  beginDrag: (props) => {
    const out = {
      id: props.id,
      categoryId: props.categoryId,
      choiceIndex: props.choiceIndex,
      value: props.content,
      itemType: 'categorize'
    };
    log('[beginDrag] out:', out);
    return out;
  },
  endDrag: (props, monitor) => {
      if (!monitor.didDrop()) {
        const item = monitor.getItem();
        if (item.categoryId) {
          log('wasnt droppped - what to do?');
          props.onRemoveChoice(item);
        }
      }
    }
};

const DraggableChoice = DragSource(
  ({ uid }) => uid,
  spec,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(Choice);

const DraggableChoiceWithProvider = (props) => (
    <DndProvider backend={HTML5Backend}>
      <DraggableChoice {...props} />
    </DndProvider>
);

export default uid.withUid(DraggableChoiceWithProvider);