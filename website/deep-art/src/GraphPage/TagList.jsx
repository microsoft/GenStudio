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
            <Box direction="column" pad="small" margin="small">
                {this.props.tags.map(label => (
                    <CheckBox
                    key={label}
                    label={label}
                    checked={this.props.tagData[label]}
                    onChange={e => this.onChange(e, label)}/>
                ))}
            </Box>
        );
    }
}