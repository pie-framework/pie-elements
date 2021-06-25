import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { DragInTheBlank } from '@pie-lib/mask-markup';
import { withDragContext } from '@pie-lib/drag';
import { color, Collapsible, hasText } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';

const DraggableDragInTheBlank = withDragContext(DragInTheBlank);

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    model: PropTypes.object,
    value: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: {}
  };

  state = {
    showCorrectAnswer: false
  };

  componentDidUpdate() {
    // eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, onChange, value, classes } = this.props;
    const { prompt, mode } = model;
    const modelWithValue = {
      ...model,
      value
    };
    const showCorrectAnswerToggle = mode === 'evaluate';

    return (
      <div className={classes.mainContainer}>
        {
          model.teacherInstructions && hasText(model.teacherInstructions) && (
            <React.Fragment>
              <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
                <div dangerouslySetInnerHTML={{ __html: model.teacherInstructions }}/>
              </Collapsible>
              <br />
            </React.Fragment>
          )
        }
        <CorrectAnswerToggle
          show={showCorrectAnswerToggle}
          toggled={showCorrectAnswer}
          onToggle={this.toggleShowCorrect}
        />
        {showCorrectAnswerToggle && <br />}
        {prompt && (
          <React.Fragment>
            <div dangerouslySetInnerHTML={{ __html: prompt }}/>
            <br />
          </React.Fragment>
        )}
        {
          model.rationale && hasText(model.rationale) && (
            <React.Fragment>
              <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
                <div dangerouslySetInnerHTML={{ __html: model.rationale }}/>
              </Collapsible>
              <br />
            </React.Fragment>
          )
        }
        <DraggableDragInTheBlank
          {...modelWithValue}
          onChange={onChange}
          showCorrectAnswer={showCorrectAnswer}
        />
      </div>
    );
  }
}


const styles = (theme) => ({
  mainContainer: {
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.background(),
    '& tr > td': {
      color: color.text()
    }
  },
});

export default withStyles(styles)(Main);

