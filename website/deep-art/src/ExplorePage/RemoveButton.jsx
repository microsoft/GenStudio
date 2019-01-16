import React, { Component } from 'react';
import { grommet } from "grommet/themes";

import { Box, Button, Grommet} from 'grommet';
import { Subtract } from "grommet-icons";

const customTheme = {
    button: {
        extend:{
            "border-radius": "12px",
            background: "#d49e49"
        }
    }
}

/**
 * Remove Icon Button with 'subClick' prop 
 */
export default class RemoveButton extends Component {
    constructor(props){
        super(props);
    };



    render() {
        return (
            <Grommet theme={customTheme}>
                <Button align="center" icon={<Subtract />} onClick={() => {this.props.subClick()}} hoverIndicator="#b6802b" />
            </Grommet>
        );
    }
}