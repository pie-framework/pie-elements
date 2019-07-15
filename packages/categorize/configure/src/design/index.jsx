import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Categories from './categories';
import Choices from './choices';
import { Divider } from './buttons';
import { buildCategories } from './builder';
import debug from 'debug';
import { uid, withDragContext } from '@pie-lib/drag';
import {
  FeedbackConfig,
  InputContainer,
  layout,
  settings,
} from '@pie-lib/config-ui';

import {
  countInAnswer,
  ensureNoExtraChoicesInAnswer
} from '@pie-lib/categorize';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle, radio } = settings;
const { Provider: IdProvider } = uid;

const log = debug('@pie-element:categorize:configure:design');

export class Design extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uid: PropTypes.string,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.uid = props.uid || uid.generateId();
  }

  updateModel = props => {
    const { model, onChange } = this.props;

    const updatedModel = {
      ...model,
      ...props
    };

    //Ensure that there are no extra choices in correctResponse, if the user has decided that only one choice may be used.
    updatedModel.correctResponse = ensureNoExtraChoicesInAnswer(
      updatedModel.correctResponse || [],
      updatedModel.choices
    );

    //clean categories
    updatedModel.categories = updatedModel.categories.map(c => ({
      id: c.id,
      label: c.label
    }));

    updatedModel.choices = updatedModel.choices.map(h => ({
      id: h.id,
      content: h.content,
      categoryCount: h.categoryCount
    }));

    onChange(updatedModel);
  };

  changeRationale = rationale => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      rationale
    });
  };

  changeTeacherInstructions = teacherInstructions => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      teacherInstructions
    });
  };

  changeFeedback = feedback => {
    this.updateModel({ feedback });
  };

  countChoiceInCorrectResponse = choice => {
    const { model } = this.props;
    const out = countInAnswer(choice.id, model.correctResponse);
    return out;
  };

  render() {
    const { classes, className, model, imageSupport, configuration, onChange, onConfigurationChanged } = this.props;
    const {
      partialScoring = {},
      lockChoiceOrder = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      scoringType = {},
      feedback = {}
    } = configuration || {};

    const config = model.config || {};
    config.choices = config.choices || { label: '', columns: 2 };

    const categories = buildCategories(
      model.categories || [],
      model.choices || [],
      model.correctResponse || []
    );

    const choices = model.choices.map(c => {
      c.correctResponseCount = this.countChoiceInCorrectResponse(c);
      return c;
    });

    return (
      <IdProvider value={this.uid}>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onChange}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                'Settings': {
                  partialScoring: partialScoring.settings &&
                    toggle(partialScoring.label),
                  lockChoiceOrder: lockChoiceOrder.settings &&
                  toggle(lockChoiceOrder.label),
                  'feedback.enabled': feedback.settings && toggle(feedback.label, true),
                },
                'Properties': {
                  'teacherInstructions.enabled': teacherInstructions.settings &&
                    toggle(teacherInstructions.label, true),
                  'studentInstructions.enabled': studentInstructions.settings &&
                    toggle(studentInstructions.label, true),
                  'rationale.enabled': rationale.settings &&
                    toggle(rationale.label, true),
                  scoringType: scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric']),
                },
              }}
            />
          }
        >
          <div className={classNames(classes.design, className)}>
            <Typography className={classes.text}>
              In Categorize, students may drag &amp; drop answer tiles to the
              appropriate category area(s).
            </Typography>

            {teacherInstructions.enabled && (
              <InputContainer label={teacherInstructions.label} className={classes.inputHolder}>
                <EditableHtml
                  className={classes.input}
                  markup={model.teacherInstructions || ''}
                  onChange={this.changeTeacherInstructions}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}

            {rationale.enabled && (
              <InputContainer label={rationale.label} className={classes.inputHolder}>
                <EditableHtml
                  className={classes.input}
                  markup={model.rationale || ''}
                  onChange={this.changeRationale}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}
            <Categories
              imageSupport={imageSupport}
              model={model}
              categories={categories}
              onModelChanged={this.updateModel}
            />
            <Divider />
            <Choices
              imageSupport={imageSupport}
              choices={choices}
              model={model}
              onModelChanged={this.updateModel}
            />

            {
              feedback.enabled && (
                <FeedbackConfig
                  feedback={model.feedback}
                  onChange={this.changeFeedback}
                />
              )
            }
          </div>
        </layout.ConfigLayout>
      </IdProvider>
    );
  }
}

const styles = theme => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  design: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  inputHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  input: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: '600px'
  },
});

export default withDragContext(withStyles(styles)(Design));
