import React, {Component} from 'react';
import {LanguageControls} from '@pie-lib/config-ui';
import Prompt from './prompt';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Choice from './choice';
import PropTypes from 'prop-types';
import ChoiceConfiguration from './choice-configuation';

const Section = withStyles({
  section: {
    padding: '20px',
    paddingTop: '40px',
    paddingBottom: '40px',
    position: 'relative',
    '&::after': {
      display: 'block',
      position: 'absolute',
      left: '0',
      top: '0',
      bottom: '0',
      right: '0',
      height: '2px',
      content: '""',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }
  }
})(({name, children, classes}) => (
  <div className={classes.section}>
    <Typography>{name}</Typography>
    <br/>
    {children}
  </div>
));


class Main extends Component {

  static propTypes = {
    model: PropTypes.object.isRequired,
    onPromptChanged: PropTypes.func.isRequired,
    onChoiceChanged: PropTypes.func.isRequired,
    onResponseTypeChanged: PropTypes.func.isRequired,
    onOrderReversed: PropTypes.func.isRequired,
    onChoiceLabelChanged: PropTypes.func.isRequired,
    onLabelTypeChanged: PropTypes.func.isRequired,
    onLangChanged: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {activeLang: props.model.activeLang, defaultLang: props.model.defaultLang, orderReversed: false}
  }

  reverseOrderHandler = () => {
    this.setState({orderReversed: !this.state.orderReversed});
    this.props.onOrderReversed();
  }

  activeLangChangeHandler = (activeLang) => {
    this.setState({activeLang});
    this.props.onLangChanged(activeLang);
  }

  defaultLangChangeHandler = (defaultLang) => {
    this.setState({defaultLang});
    this.props.onLangChanged(defaultLang);
  }

  render() {

    const {model, onPromptChanged, onChoiceChanged, onResponseTypeChanged, onChoiceLabelChanged, onLabelTypeChanged} = this.props;
    const {activeLang, defaultLang, orderReversed} = this.state;

    return (
      <div>
        <Choice onResponseTypeChanged={onResponseTypeChanged} onChoiceLabelChanged={onChoiceLabelChanged} onLabelTypeChanged={onLabelTypeChanged}/>
        <Section name="">
          <LanguageControls
            langs={['en-US', 'es-ES']}
            activeLang={activeLang}
            defaultLang={defaultLang}
            onActiveLangChange={this.activeLangChangeHandler}
            onDefaultLangChange={this.defaultLangChangeHandler}
          />
        </Section>
        <Prompt prompt={model.prompt} onPromptChanged={onPromptChanged}/>
        <Typography><Checkbox checked={orderReversed} onChange={this.reverseOrderHandler}/>Reverse Order</Typography>
        {model.choices.map((v, i) => (<ChoiceConfiguration
          key={i}
          index={i + 1}
          mode={'radio'}
          data={v}
          defaultFeedback={{
            correct: 'Correct',
            incorrect: 'Incorrect'
          }}
          onChange={c => onChoiceChanged(i, c)}
        />))}
      </div>
    )
  }
}

export default Main;