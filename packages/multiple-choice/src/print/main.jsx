import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import classNames from 'classnames';
import { PreviewLayout } from '@pie-lib/render-ui';
import MultipleChoice from '../multiple-choice';
import defaults from './defaults';
import isEmpty from 'lodash/isEmpty';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    classes: PropTypes.object.isRequired,
    printOptions: PropTypes.shape({
      mode: PropTypes.oneOf(['student', 'instructor']),
    }),
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
    const { model, session, classes, printOptions } = this.props;
    // const updatedModel =  ? { ...printDefaults, ...model } : model;

    // TODO: EBSR should not pollute multiple-choice!
    // model.partLabel is a property used for ebsr
    return (
      <PreviewLayout>
        {model.partLabel && <p>{model.partLabel}</p>}
        <div className={classNames(classes.root, classes[model.className])}>
          <MultipleChoice {...model} session={session} />
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
