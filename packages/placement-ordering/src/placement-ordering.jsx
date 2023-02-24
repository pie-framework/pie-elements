import { HorizontalTiler, VerticalTiler } from './tiler';
import { buildState, reducer } from './ordering';
import { color, Feedback, Collapsible, hasText, PreviewPrompt } from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import PropTypes from 'prop-types';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import debug from 'debug';
import uniqueId from 'lodash/uniqueId';
import { withStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';
import isEqual from 'lodash/isEqual';

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
    this.state = {
      showingCorrect: false,
    };

    this.instanceId = uniqueId();

    this.toggleCorrect = (showingCorrect) => {
      this.setState({ showingCorrect });
    };
  }

  isValidSession = ({ model, session }) => {
    const { config } = model;

    const compactSessionValues = (session && compact(session.value)) || [];
    const completeSession = compactSessionValues.length === model.choices.length;

    // if it includes targets, it doesn't have to contain all the choices selected (eg: only 2 targets were filled)
    // but if it does not include targets, it's a must to have all choices selected
    return config.includeTargets || completeSession;
  };

  componentDidMount() {
    const { model, session } = this.props;

    if (!this.isValidSession({ model, session })) {
      this.setState(
        {
          defaultSessionValue: cloneDeep(session?.value),
        },
        () => this.initSessionIfNeeded(this.props),
      );
    }
  }

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};
    const { correctResponse, config, choices } = nextProps?.model;
    const { config: oldConfig, choices: oldChoices } = this.props?.model || {};

    if (!correctResponse) {
      newState.showingCorrect = false;
    }

    const includeTargetsChanged = config.includeTargets !== oldConfig.includeTargets;
    const choicesChanged = !isEqual(oldChoices, choices);
    const isDefaultSession = isEqual(this.state.defaultSessionValue, this.props.session?.value);
    const isValidSession = this.isValidSession({ model: nextProps.model, session: nextProps.session });

    // if the session is not valid anymore, it has to be reset
    // OR
    // if the session is the default one (set if the initial session was not valid or empty)
    //  and targets or choices changed, then we can reset the session
    //  but if the session is not the default one (it was set by the student), then we do not reset it
    if (!isValidSession || (isDefaultSession && (includeTargetsChanged || choicesChanged))) {
      this.initSessionIfNeeded(nextProps);
    }

    this.setState(newState);
  }

  initSessionIfNeeded(props) {
    const { model, session, onSessionChange } = props;
    const { config: newConfig } = model;

    const update = cloneDeep(session);

    update.value = model.choices.map((m) => m.id);

    if (newConfig.includeTargets) {
      delete update.value;
    }

    this.setState({ defaultSessionValue: cloneDeep(update?.value) }, () => onSessionChange(update));
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
          <React.Fragment>
            <Collapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              className={classes.collapsible}
            >
              <PreviewPrompt prompt={teacherInstructions} />
            </Collapsible>
            <br />
          </React.Fragment>
        )}
        <div className={classes.prompt}>
          <PreviewPrompt prompt={prompt} />
        </div>
        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
          className={classes.toggle}
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
        <br />
        {displayNote && (
          <div className={classes.note} dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }} />
        )}
        {rationale && hasText(rationale) && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }} className={classes.collapsible}>
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
        {!showingCorrect && <Feedback correctness={correctness} feedback={feedback} />}
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
    paddingBottom: theme.spacing.unit,
  },
  prompt: {
    padding: '5px',
    paddingBottom: '15px',
  },
  note: {
    padding: '5px',
  },
  collapsible: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    alignSelf: 'flex-start',
  },
  toggle: {
    paddingBottom: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(PlacementOrdering);
