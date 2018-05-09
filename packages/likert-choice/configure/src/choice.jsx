import React, {Component, Fragment} from 'react';
import {NChoice} from '@pie-lib/config-ui';

export default class Choice extends Component {

    constructor(props) {
        super(props);
        this.state = {response: '', choice: '', type: ''}
    }

    render() {
        return (
            <Fragment>
                <NChoice
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
            </Fragment>
        )
    }

}