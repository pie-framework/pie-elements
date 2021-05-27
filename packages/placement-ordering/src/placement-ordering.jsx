import { HorizontalTiler, VerticalTiler } from './tiler';
import { buildState, reducer } from './ordering';
import { color, Feedback, Collapsible, hasText } from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import PropTypes from 'prop-types';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import debug from 'debug';
import uniqueId from 'lodash/uniqueId';
import { withStyles } from '@material-ui/core/styles';

const log = debug('pie-elements:placement-ordering');

const OrderingTiler = props => {
  const {
    tiler: Comp,
    ordering,
    onDropChoice,
    onRemoveChoice,
    ...compProps
  } = props;

  return (
    <Comp
      {...compProps}
      tiles={ordering.tiles}
      onDropChoice={(t, s) => onDropChoice(t, s, ordering)}
      onRemoveChoice={t => onRemoveChoice(t, ordering)}
    />
  );
};

OrderingTiler.propTypes = {
  tiler: PropTypes.func,
  ordering: PropTypes.any,
  onDropChoice: PropTypes.func,
  onRemoveChoice: PropTypes.func
};

export class PlacementOrdering extends React.Component {
  static propTypes = {
    onSessionChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    session: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ]),
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showingCorrect: false
    };

    this.instanceId = uniqueId();

    this.toggleCorrect = showingCorrect => {
      this.setState({ showingCorrect });
    };
  }

  componentDidMount() {
    this.initSessionIfNeeded(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};

    if (!nextProps.model.correctResponse) {
      newState.showingCorrect = false;
    }

    const includeTargetsChanged =
      nextProps.model.config.includeTargets !==
      this.props.model.config.includeTargets;
    const choicesNumberChanged =
      nextProps.model.choices.length !== this.props.model.choices.length;

    if (includeTargetsChanged || choicesNumberChanged) {
      this.initSessionIfNeeded(nextProps, true);
    }

    this.setState(newState);
  }

  initSessionIfNeeded(props, reset) {
    const { model, session, onSessionChange } = props;
    const { config: newConfig } = model;

    const compactSessionValues = (session && compact(session.value)) || [];

    if (
      !newConfig.includeTargets &&
      compactSessionValues.length !== model.choices.length
    ) {
      log('[initSessionIfNeeded] initing session...', newConfig.includeTargets);
      const update = cloneDeep(session);

      update.value = model.choices.map(m => m.id);
      onSessionChange(update);
    } else if (newConfig.includeTargets) {
      const update = cloneDeep(session);

      if (reset) {
        delete update.value;
      }

      onSessionChange(update);
    }
  }

  onDropChoice = (target, source, ordering) => {
    const { onSessionChange, session } = this.props;
    const from = ordering.tiles.find(
      t => t.id === source.id && t.type === source.type
    );
    const to = target;
    log('[onDropChoice] ', from, to);
    const update = reducer({ type: 'move', from, to }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response
    });

    onSessionChange(sessionUpdate);
  };

  onRemoveChoice = (target, ordering) => {
    const { onSessionChange, session } = this.props;
    log('[onRemoveChoice]', target);
    const update = reducer({ type: 'remove', target }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response
    });
    onSessionChange(sessionUpdate);
  };

  createOrdering = () => {
    const { model, session } = this.props;
    const { showingCorrect } = this.state;
    const config = model.config || {
      orientation: 'vertical',
      includeTargets: true
    };
    const { includeTargets } = config;

    return showingCorrect
      ? buildState(
        model.choices,
        model.correctResponse,
        model.correctResponse.map(id => ({ id, outcome: 'correct' })),
        {
          includeTargets,
          allowSameChoiceInTargets: model.config.allowSameChoiceInTargets
        }
      )
      : buildState(model.choices, session.value, model.outcomes, {
        includeTargets,
        allowSameChoiceInTargets: model.config.allowSameChoiceInTargets
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
      teacherInstructions
    } = model;
    const showToggle = correctResponse && correctResponse.length > 0;
    const { showingCorrect } = this.state;
    const config = configs || {
      orientation: 'vertical',
      includeTargets: true
    };
    const { orientation, includeTargets } = config;
    const vertical = orientation === 'vertical';
    const ordering = this.createOrdering();
    const { mode, role } = env || {};

    const Tiler = vertical ? VerticalTiler : HorizontalTiler;
    const displayNote = (showingCorrect || mode === 'view' && role === 'instructor') && showNote && note;

    return (
      <div className={classes.placementOrdering}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <Collapsible
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
            className={classes.collapsible}
          >
            <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
          </Collapsible>
        )}
        <br/>
        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
        />
        <div
          className={classes.prompt}
          dangerouslySetInnerHTML={{ __html: prompt }}
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
          onDropChoice={this.onDropChoice}
          onRemoveChoice={this.onRemoveChoice}
        />
        <br/>
        {displayNote && (
          <div
            className={classes.note}
            dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> ${note}` }}
          />
        )}
        {rationale && hasText(rationale) && (
          <Collapsible
            labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
            className={classes.collapsible}
          >
            <div dangerouslySetInnerHTML={{ __html: rationale }}/>
          </Collapsible>
        )}
        {!showingCorrect && (
          <Feedback correctness={correctness} feedback={feedback}/>
        )}
      </div>
    );
  }
}

const styles = theme => ({
  placementOrdering: {
    color: color.text(),
    backgroundColor: color.background(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingBottom: theme.spacing.unit
  },
  prompt: {
    padding: '5px',
    paddingBottom: '15px'
  },
  note: {
    padding: '5px'
  },
  collapsible: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    alignSelf: 'flex-start'
  }
});

export default withStyles(styles)(PlacementOrdering);
