import React, {Component} from 'react';
import {NChoice, LanguageControls} from '@pie-lib/config-ui';
import InputComponent from './input-component';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styled = {
    commonFlex: {
        '& > div': {
            flexDirection: 'column',
            color: 'yellow'
        }
    }
}

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
        this.state = {response: '', choice: '', type: '', activeLang: 'en-US', defaultLang: 'en-US'}
    }

    render() {

        const {classes} = this.props;

        return (
            <div>
                <NChoice
                    style={styled.commonFlex}
                    header="Response Type"
                    value={this.state.response}
                    onChange={response => this.setState({response})}
                    opts={[
                        {label: 'Likert 3', value: '3'},
                        {label: 'Likert 5', value: '5'},
                        {label: 'Likert 7', value: '7'}
                    ]}
                />
                <NChoice
                    header="Choice Labels"
                    value={this.state.choice}
                    onChange={choice => this.setState({choice})}
                    opts={[
                        {label: 'Numbers', value: 'numbers'},
                        {label: 'Letters', value: 'letters'},
                        {label: 'Graphics', value: 'graphics'},
                        {label: 'None', value: 'none'}
                    ]}
                />
                <NChoice
                    header="Label Type"
                    value={this.state.type}
                    onChange={type => this.setState({type})}
                    opts={[
                        {label: 'Agreement', value: 'agreement'},
                        {label: 'Frequency', value: 'frequency'},
                        {label: 'Yes/No', value: 'yesno'},
                        {label: 'Likelihood', value: 'likelihood'},
                        {label: 'Importance', value: 'importance'},
                        {label: 'None', value: 'none'},
                        {label: 'Custom', value: 'custom'}
                    ]}
                />
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
            </div>
        )
    }
}


export default withStyles(styled)(Main);