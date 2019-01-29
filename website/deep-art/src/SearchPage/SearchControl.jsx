import React, { Component } from 'react';

import { Box, Button, Grommet, Select, Text, TextInput} from 'grommet';

export default class SearchControl extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: ""
        };
    };

    onChange = event => {
        this.setState({ value: event.target.value});
        this.props.sendChange(event.target.value);
    }

    render(){
        const {value} = this.state.value;
        return(
            <Box style={{paddingTop: "20px"}}>
                <TextInput
                type="search"
                value={value}
                placeholder="Search"
                onChange={this.onChange}
                />
            </Box>

        );
    }

}