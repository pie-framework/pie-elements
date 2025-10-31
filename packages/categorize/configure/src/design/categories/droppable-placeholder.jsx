import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import ChoicePreview from './choice-preview';
import { DropTarget } from 'react-dnd';
import { uid, PlaceHolder } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('@pie-element:categorize:configure');

const Helper = withStyles((theme) => ({
  helper: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.fontSize - 2,
    color: `rgba(${theme.palette.common.black}, 0.4)`,
    width: '100%',
    height: '100%',
  },
}))(({ classes }) => <div className={classes.helper}>Drag your correct answers here</div>);

const Previews = ({ alternateResponseIndex, category, choices, onDeleteChoice }) => (
  <React.Fragment>
    {choices.map(
      (c, index) =>
        c && (
          <ChoicePreview
            alternateResponseIndex={alternateResponseIndex}
            category={category}
            choice={c}
            key={index}
            choiceIndex={index}
            onDelete={(choice) => onDeleteChoice(choice, index)}
          />
        ),
    )}
  </React.Fragment>
);

Previews.propTypes = {
  alternateResponseIndex: PropTypes.number,
  category: PropTypes.object,
  choices: PropTypes.array,
  onDeleteChoice: PropTypes.func,
};

export class DroppablePlaceHolder extends React.Component {
  static propTypes = {
    alternateResponseIndex: PropTypes.number,
    category: PropTypes.object,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    connectDropTarget: PropTypes.func.isRequired,
    choices: PropTypes.array,
    onDropChoice: PropTypes.func.isRequired,
    onMoveChoice: PropTypes.func,
    isOver: PropTypes.bool,
    onDeleteChoice: PropTypes.func,
    categoryId: PropTypes.string.isRequired,
  };

  static defaultProps = {};
  render() {
    const { alternateResponseIndex, isOver, category, choices, classes, className, connectDropTarget, onDeleteChoice } =
      this.props;

    return connectDropTarget(
      <div className={classNames(classes.droppablePlaceholder, className)}>
        <PlaceHolder isOver={isOver} className={classes.placeHolder}>
          {(choices || []).length === 0 ? (
            <Helper />
          ) : (
            <Previews
              alternateResponseIndex={alternateResponseIndex}
              category={category}
              choices={choices}
              onDeleteChoice={onDeleteChoice}
            />
          )}
        </PlaceHolder>
      </div>,
    );
  }
}
const styles = () => ({
  droppablePlaceholder: {
    minHeight: '100px',
  },
  placeHolder: {
    width: '100%',
    minHeight: '100px',
    height: 'auto',
  },
});

const Styled = withStyles(styles)(DroppablePlaceHolder);

export const spec = {
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();

    if (item.from && item.alternateResponseIndex === props.alternateResponseIndex) {
      props.onMoveChoice(item.choiceId, item.from, props.categoryId, item.choiceIndex, item.alternateResponseIndex);
    } else if (!item.from) {
      // avoid dropping choice when user tries to move it to an alternate with other index
      props.onDropChoice(item, props.categoryId);
    }
  },
  canDrop: (props /*, monitor*/) => {
    return !props.disabled;
  },
};

const WithTarget = DropTarget(
  ({ uid }) => uid,
  spec,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)(Styled);

export default uid.withUid(WithTarget);
