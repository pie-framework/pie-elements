import React, {Component} from 'react';
import {LanguageControls, ChoiceConfiguration} from '@pie-lib/config-ui';
import Prompt from './prompt';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Choice from './choice';
import PropTypes from 'prop-types';

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
})(({ name, children, classes }) => (
    <div className={classes.section}>
        <Typography>{name}</Typography>
        <br />
        {children}
    </div>
));


class Main extends Component {

    static propTypes = {
        model: PropTypes.object.isRequired,
        onPromptChanged: PropTypes.func.isRequired,
        onChoiceChanged: PropTypes.func.isRequired,
        onResponseTypeChanged: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {activeLang: props.model.activeLang, defaultLang: props.model.defaultLang}
    }

    filter(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].lang === nameKey) {
                return myArray[i];
            }
        }
    }

    render() {

        const {model, onPromptChanged, onChoiceChanged, onResponseTypeChanged, onChoiceLabelChanged} = this.props;
        const {activeLang, defaultLang} = this.state;

        return (
            <div>
                <Choice onResponseTypeChanged={onResponseTypeChanged} onChoiceLabelChanged={onChoiceLabelChanged}/>
                <Section name="">
                <LanguageControls
                    langs={['en-US', 'es-ES']}
                    activeLang={activeLang}
                    defaultLang={defaultLang}
                    onActiveLangChange={activeLang => this.setState({ activeLang })}
                    onDefaultLangChange={defaultLang =>
                        this.setState({ defaultLang })
                    }
                />
                </Section>
                <Prompt prompt={model.prompt} onPromptChanged={onPromptChanged}/>
                {model.choices.map((v,i) => (<ChoiceConfiguration
                    key={i}
                    index={i+1}
                    mode={'radio'}
                    data={this.filter(activeLang,v.label)}
                    defaultFeedback={{
                        correct: 'Correct',
                        incorrect: 'Incorrect'
                    }}
                    onChange={c => onChoiceChanged(i, c)}
                    onDelete={() => console.log("onDelete")}
                />))}
            </div>
        )
    }
}

export default Main;