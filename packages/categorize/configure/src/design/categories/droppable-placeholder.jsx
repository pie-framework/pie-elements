import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ChoicePreview from './choice-preview';
import { DropTarget } from 'react-dnd';
import { idContext } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('@pie-element:categorize:configure');

import { PlaceHolder } from '@pie-lib/drag';

const Helper = withStyles(() => ({
  helper: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%'
  }
}))(({ classes }) => (
  <div className={classes.helper}>Drag your correct answers here</div>
));

const Previews = ({ choices, onDeleteChoice }) => (
  <React.Fragment>
    {choices.map((c, index) => (
      <ChoicePreview
        choice={c}
        key={index}
        onDelete={choice => onDeleteChoice(choice, index)}
      />
    ))}
  </React.Fragment>
);

Previews.propTypes = {
  choices: PropTypes.array,
  onDeleteChoice: PropTypes.func
};

export class DroppablePlaceHolder extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    connectDropTarget: PropTypes.func.isRequired,
    choices: PropTypes.array,
    onDropChoice: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    onDeleteChoice: PropTypes.func,
    categoryId: PropTypes.string.isRequired
  };

  static defaultProps = {};
  render() {
    const {
      isOver,
      choices,
      classes,
      className,
      connectDropTarget,
      onDeleteChoice
    } = this.props;

    return connectDropTarget(
      <div className={classNames(classes.droppablePlaceholder, className)}>
        <PlaceHolder isOver={isOver} className={classes.placeHolder}>
          {(choices || []).length === 0 ? (
            <Helper />
          ) : (
            <Previews choices={choices} onDeleteChoice={onDeleteChoice} />
          )}
        </PlaceHolder>
      </div>
    );
  }
}
const styles = () => ({
  droppablePlaceholder: {
    minHeight: '100px'
  },
  placeHolder: {
    width: '100%',
    minHeight: '100px'
  }
});

const Styled = withStyles(styles)(DroppablePlaceHolder);

export const spec = {
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();
    props.onDropChoice(item, props.categoryId);
  },
  canDrop: (props /*, monitor*/) => {
    return !props.disabled;
  }
};

const WithTarget = DropTarget(({ uid }) => uid, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(Styled);

export default idContext.withUid(WithTarget);
