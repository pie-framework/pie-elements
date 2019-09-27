import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import {
  FeedbackConfig,
  InputContainer,
  layout,
  settings
} from '@pie-lib/config-ui';
import {
  countInAnswer,
  ensureNoExtraChoicesInAnswer
} from '@pie-lib/categorize';
import EditableHtml from '@pie-lib/editable-html';
import { uid, withDragContext } from '@pie-lib/drag';

import Categories from './categories';
import AlternateResponses from './categories/alternateResponses';
import Choices from './choices';
import { Divider } from './buttons';
import { buildAlternateResponses, buildCategories } from './builder';
import Header from './header';

const { Panel, toggle, radio } = settings;
const { Provider: IdProvider } = uid;

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

  onAddAlternateResponse = () => {
    const {
      model: { correctResponse }
    } = this.props;

    this.updateModel({
      correctResponse: (correctResponse || []).map(cr => ({
        ...cr,
        alternateResponses: [...(cr.alternateResponses || []), []]
      }))
    });
  };

  onPromptChanged = prompt => this.updateModel({ prompt });

  onRemoveAlternateResponse = index => {
    const {
      model: { correctResponse }
    } = this.props;

    this.updateModel({
      correctResponse: (correctResponse || []).map(cr => ({
        ...cr,
        alternateResponses: (cr.alternateResponses || []).filter(
          (alt, altIndex) => altIndex !== index
        )
      }))
    });
  };

  countChoiceInCorrectResponse = choice => {
    const { model } = this.props;

    return countInAnswer(choice.id, model.correctResponse);
  };

  render() {
    const {
      classes,
      className,
      model,
      imageSupport,
      configuration,
      onChange,
      onConfigurationChanged
    } = this.props;
    const {
      partialScoring = {},
      lockChoiceOrder = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      scoringType = {},
      feedback = {},
      prompt = {}
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled } =
      model || {};

    const config = model.config || {};
    config.choices = config.choices || { label: '', columns: 2 };

    const categories = buildCategories(
      model.categories || [],
      model.choices || [],
      model.correctResponse || []
    );

    const alternateResponses = buildAlternateResponses(
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
                Settings: {
                  partialScoring:
                    partialScoring.settings && toggle(partialScoring.label),
                  lockChoiceOrder:
                    lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  'feedback.enabled':
                    feedback.settings && toggle(feedback.label, true)
                },
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  studentInstructionsEnabled:
                    studentInstructions.settings &&
                    toggle(studentInstructions.label),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  scoringType:
                    scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric'])
                }
              }}
            />
          }
        >
          <div className={classNames(classes.design, className)}>
            {prompt.settings && promptEnabled && (
              <InputContainer
                label={prompt.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.prompt || ''}
                  onChange={this.onPromptChanged}
                  imageSupport={imageSupport}
                  nonEmpty={!prompt.settings}
                  disableUnderline
                />
              </InputContainer>
            )}

            {teacherInstructionsEnabled && (
              <InputContainer
                label={teacherInstructions.label}
                className={classes.inputHolder}
              >
                <EditableHtml
                  className={classes.input}
                  markup={model.teacherInstructions || ''}
                  onChange={this.changeTeacherInstructions}
                  imageSupport={imageSupport}
                  nonEmpty={false}
                />
              </InputContainer>
            )}

            {rationaleEnabled && (
              <InputContainer
                label={rationale.label}
                className={classes.inputHolder}
              >
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
              categories={categories || []}
              onModelChanged={this.updateModel}
            />

            <Header
              className={classes.alternatesHeader}
              label="Alternate Responses"
              buttonLabel="ADD AN ALTERNATE RESPONSE"
              onAdd={this.onAddAlternateResponse}
            />

            {alternateResponses.map((categoriesList, index) => {
              return (
                <React.Fragment key={index}>
                  <Header
                    className={classes.alternatesHeader}
                    label="Alternate Response"
                    buttonLabel="REMOVE ALTERNATE RESPONSE"
                    onAdd={() => this.onRemoveAlternateResponse(index)}
                  />

                  <AlternateResponses
                    altIndex={index}
                    imageSupport={imageSupport}
                    model={model}
                    categories={categoriesList}
                    onModelChanged={this.updateModel}
                  />
                </React.Fragment>
              );
            })}

            <Divider />
            <Choices
              imageSupport={imageSupport}
              choices={choices}
              model={model}
              onModelChanged={this.updateModel}
            />

            {feedback.enabled && (
              <FeedbackConfig
                feedback={model.feedback}
                onChange={this.changeFeedback}
              />
            )}
          </div>
        </layout.ConfigLayout>
      </IdProvider>
    );
  }
}

const styles = theme => ({
  alternatesHeader: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
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
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  title: {
    marginBottom: '30px'
  }
});

export default withDragContext(withStyles(styles)(Design));
