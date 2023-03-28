import { HorizontalTiler, VerticalTiler } from './tiler';
import { buildState, reducer } from './ordering';
import { color, Feedback, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import uniqueId from 'lodash/uniqueId';
import { withStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';

const log = debug('pie-elements:placement-ordering');

const OrderingTiler = (props) => {
  const { tiler: Comp, ordering, onDropChoice, onRemoveChoice, ...compProps } = props;

  return (
    <Comp
      {...compProps}
      tiles={ordering.tiles}
      onDropChoice={(t, s) => onDropChoice(t, s, ordering)}
      onRemoveChoice={(t) => onRemoveChoice(t, ordering)}
    />
  );
};

OrderingTiler.propTypes = {
  tiler: PropTypes.func,
  ordering: PropTypes.any,
  onDropChoice: PropTypes.func,
  onRemoveChoice: PropTypes.func,
};

export class PlacementOrdering extends React.Component {
  static propTypes = {
    onSessionChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    session: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.object.isRequired]),
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();

    const { value, needsReset } = this.validateSession(props);

    this.state = {
      showingCorrect: false,
    };

    if (needsReset) {
      this.props.onSessionChange({
        ...props.session,
        value
      });
    }
  }

  toggleCorrect = showingCorrect => this.setState({ showingCorrect });

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  validateSession = ({ model, session }) => {
    const { config, choices, env } = model || {};
    const { mode } = env || {};
    const { includeTargets } = config || {};
    let { value } = session || {};
    let needsReset;

    if (mode !== 'gather') {
      return { value };
    }

    const choicesIds = choices.map(c => c.id);

    if (!includeTargets) {
      if (!value || !value.length) {
        // if there's no value on session in No Targets Mode, we need to set an initial session
        value = choicesIds;
      } else {
        // in No Targets Mode, all choice ids need to be used
        const missingChoiceIds = difference(choicesIds, value);
        // this is the case that handles extra choice ids in session
        const extraChoiceIds = difference(value, choicesIds);

        if (missingChoiceIds.length || extraChoiceIds.length) {
          value = choicesIds;
        }
      }

      needsReset = !isEqual(session.value, value);
    } else {
      // in Targets Area selected, it's important to check the length of session
      if (value && choicesIds.length !== value.length) {
        needsReset = true;

        // if choices were added, add value in session
        if (value.length < choicesIds.length) {
          value = value.concat(new Array(choicesIds.length - value.length));
        } else {
          // if choices were removed, make sure to remove from session as well
          value = value.filter(cId => choicesIds.includes(cId));
        }
      }
    }

    return { value, needsReset };
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};
    const { correctResponse, config } = nextProps?.model;
    const { includeTargets } = config || {};

    if (!correctResponse) {
      newState.showingCorrect = false;
    }

    const validatedSession = this.validateSession(nextProps);
    let { value, needsReset } = validatedSession;

    const newSession = {
      ...nextProps.session,
      value
    };
    const includeTargetsChanged = this.props.model?.config?.includeTargets !== includeTargets;

    if (includeTargets && includeTargetsChanged) {
      needsReset = true;

      delete newSession.value;
    }

    this.setState(newState, () => {
      if (needsReset) {
        this.props.onSessionChange(newSession);
      }
    });
  }

  onDropChoice = (target, source, ordering) => {
    const { onSessionChange, session } = this.props;
    const from = ordering.tiles.find((t) => t.id === source.id && t.type === source.type);
    const to = target;
    log('[onDropChoice] ', from, to);
    const update = reducer({ type: 'move', from, to }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response,
    });

    onSessionChange(sessionUpdate);
  };

  onRemoveChoice = (target, ordering) => {
    const { onSessionChange, session } = this.props;
    log('[onRemoveChoice]', target);
    const update = reducer({ type: 'remove', target }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response,
    });
    onSessionChange(sessionUpdate);
  };

  createOrdering = () => {
    const { model, session } = this.props;
    const { showingCorrect } = this.state;
    const config = model.config || {
      orientation: 'vertical',
      includeTargets: true,
    };
    const { includeTargets } = config;

    return showingCorrect
      ? buildState(
        model.choices,
        model.correctResponse,
        model.correctResponse.map((id) => ({ id, outcome: 'correct' })),
        {
          includeTargets,
          allowSameChoiceInTargets: model.config.allowSameChoiceInTargets,
        },
      )
      : buildState(model.choices, session.value, model.outcomes, {
        includeTargets,
        allowSameChoiceInTargets: model.config.allowSameChoiceInTargets,
      });
  };

  render() {
    const { classes, model } = this.props;
    const {
      correctResponse,
      correctness,
      prompt,
      rationale,
      feedback,
      config: configs,
      note,
      showNote,
      env,
      disabled,
      teacherInstructions,
    } = model;
    const showToggle = correctResponse && correctResponse.length > 0;
    const { showingCorrect } = this.state;
    const config = configs || {
      orientation: 'vertical',
      includeTargets: true,
    };
    const { orientation, includeTargets } = config;
    const vertical = orientation === 'vertical';
    const ordering = this.createOrdering();
    const { mode, role } = env || {};

    const Tiler = vertical ? VerticalTiler : HorizontalTiler;
    const displayNote = (showingCorrect || (mode === 'view' && role === 'instructor')) && showNote && note;

    return (
      <div className={classes.placementOrdering}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <Collapsible
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            className={classes.collapsible}
          >
            <PreviewPrompt prompt={teacherInstructions}/>
          </Collapsible>
        )}

        <div className={classes.prompt}>
          <PreviewPrompt prompt={prompt}/>
        </div>

        <CorrectAnswerToggle
          className={classes.toggle}
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
        />

        <OrderingTiler
          instanceId={this.instanceId}
          choiceLabel={config.choiceLabel}
          targetLabel={config.targetLabel}
          ordering={ordering}
          tiler={Tiler}
          disabled={disabled}
          addGuide={config.showOrdering}
          tileSize={config.tileSize}
          includeTargets={includeTargets}
          choiceLabelEnabled={model.config && model.config.choiceLabelEnabled}
          onDropChoice={this.onDropChoice}
          onRemoveChoice={this.onRemoveChoice}
        />

        {displayNote && (
          <div className={classes.note} dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }}/>
        )}

        {rationale && hasText(rationale) && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }} className={classes.collapsible}>
            <PreviewPrompt prompt={rationale}/>
          </Collapsible>
        )}

        {!showingCorrect && <Feedback correctness={correctness} feedback={feedback}/>}
      </div>
    );
  }
}

const styles = (theme) => ({
  placementOrdering: {
    color: color.text(),
    backgroundColor: color.background(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  prompt: {
    paddingBottom: theme.spacing.unit,
  },
  toggle: {
    paddingBottom: theme.spacing.unit,
  },
  note: {
    paddingBottom: theme.spacing.unit * 2,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
    alignSelf: 'flex-start',
  },
});

export default withStyles(styles)(PlacementOrdering);
