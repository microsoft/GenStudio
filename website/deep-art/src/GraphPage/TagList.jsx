import React, { Component } from 'react';
import { Box, CheckBox } from 'grommet';

export default class TagList extends Component {

    constructor(props){
        super(props);
        this.state = {
        };

    };

    onChange = (event, label) => {
        this.props.tagChange(label, event.target.checked);
    }

    render(){
        return(
            <Box direction="column">
                {this.props.tags.map(label => (
                    <CheckBox
                    key={label}
                    label={label}
                    onChange={e => this.onChange(e, label)}/>
                ))}
            </Box>
        );
    }
}