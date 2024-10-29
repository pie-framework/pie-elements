import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { PreviewLayout } from '@pie-lib/pie-toolbox/render-ui';
import MultipleChoice from './multiple-choice';

const styles = () => ({});

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onChoiceChanged: PropTypes.func,
    classes: PropTypes.object.isRequired,
    onShowCorrectToggle: PropTypes.func,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
  };

  static defaultProps = {
    model: {},
    session: {},
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { model, onChoiceChanged, session, onShowCorrectToggle } = this.props;
    const { extraCSSRules } = model;

    // model.partLabel is a property used for ebsr
    return (
      <PreviewLayout extraCSSRules={extraCSSRules}>
        <MultipleChoice
          {...model}
          session={session}
          onChoiceChanged={onChoiceChanged}
          onShowCorrectToggle={onShowCorrectToggle}
        />
      </PreviewLayout>
    );
  }
}

const Styled = withStyles(styles, { name: 'Main' })(Main);

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
