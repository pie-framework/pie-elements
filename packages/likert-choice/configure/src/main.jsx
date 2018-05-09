import React, {Component} from 'react';
import {LanguageControls, ChoiceConfiguration} from '@pie-lib/config-ui';
import InputComponent from './input-component';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Choice from './choice';

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
    constructor(props) {
        super(props);
        this.state = {activeLang: props.model.activeLang, defaultLang: props.model.defaultLang}
    }

    filter(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].lang === nameKey) {
                console.log(myArray[i].value);
                return myArray[i];
            }
        }
    }

    render() {

        return (
            <div>
                <Choice />
                <Section name="">
                <LanguageControls
                    langs={['en-US', 'es-ES']}
                    activeLang={this.state.activeLang}
                    defaultLang={this.state.defaultLang}
                    onActiveLangChange={activeLang => this.setState({ activeLang })}
                    onDefaultLangChange={defaultLang =>
                        this.setState({ defaultLang })
                    }
                />
                </Section>
                <InputComponent/>
                {this.props.model.choices.map((v,i) => (<ChoiceConfiguration
                    key={i}
                    index={i+1}
                    mode={'radio'}
                    data={this.filter(this.state.activeLang,v.label)}
                    defaultFeedback={{
                        correct: 'Correct',
                        incorrect: 'Incorrect'
                    }}
                    onChange={() => console.log("onChange")}
                    onDelete={() => console.log("onDelete")}
                />))}
            </div>
        )
    }
}


export default Main;