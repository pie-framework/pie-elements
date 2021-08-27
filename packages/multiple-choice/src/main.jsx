import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import classNames from 'classnames';
import { PreviewLayout } from '@pie-lib/render-ui';
import MultipleChoice from './multiple-choice';
import printDefaults from './printDefaults';
import isEmpty from 'lodash/isEmpty';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onChoiceChanged: PropTypes.func,
    classes: PropTypes.object.isRequired,
    printOptions: PropTypes.object,
  };

  static defaultProps = {
    model: {},
    session: {},
    printOptions: {},
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { model, onChoiceChanged, session, classes, printOptions } = this.props;
    const printMode = !isEmpty(printOptions);
    const updatedModel = printMode ? { ...printDefaults, ...model} : model;

    // model.partLabel is a property used for ebsr
    return (
      <PreviewLayout>
        {model.partLabel && <p>{model.partLabel}</p>}
        <div className={classNames(classes.root, classes[model.className])}>
          <MultipleChoice
            {...updatedModel}
            session={session}
            onChoiceChanged={onChoiceChanged}
            printOptions={printOptions}
            printMode={printMode}
          />
        </div>
      </PreviewLayout>
    );
  }
}

const Styled = withStyles({}, { name: 'Main' })(Main);

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const Root = (props) => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default Root;
