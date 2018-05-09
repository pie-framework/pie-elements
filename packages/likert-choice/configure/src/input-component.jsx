import React , {Component} from 'react';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    promptHolder: {
        width: '100%',
        paddingBottom: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    },
    prompt: {
        paddingTop: theme.spacing.unit * 2,
        width: '100%'
    }
});

class InputComponent extends Component {

    constructor(props){
        super(props);
    }

    render(){

        const {classes} = this.props;

        return (<div>
            <InputContainer label="Prompt" className={classes.promptHolder}>
                <EditableHtml
                    className={classes.prompt}
                    markup=''
                    onChange={() => console.log('Hello')}
                />
            </InputContainer>
        </div>)
    }
}

export default withStyles(styles)(InputComponent);