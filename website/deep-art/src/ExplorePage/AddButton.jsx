import React, { Component } from 'react';
import { grommet } from "grommet/themes";

import { Box, Button, Grommet} from 'grommet';
import { Add } from "grommet-icons";

const customTheme = {
    button: {
        extend:{
            "border-radius": "12px",
            background: "#d49e49"
        }
    }
}

/**
 * Add Icon Button with 'addClick' prop 
 */
export default class AddButton extends Component {
    constructor(props){
        super(props);
    };

    render(){
        return (
            <Grommet theme={customTheme}>
                <Button icon={<Add />} onClick={() => {this.props.addClick()}} hoverIndicator="#b6802b" />
            </Grommet>
        );
    }
}