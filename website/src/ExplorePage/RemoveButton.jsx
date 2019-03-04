import React, { Component } from 'react';

import { Button, Grommet} from 'grommet';
import { Subtract } from "grommet-icons";

const customTheme = {
    button: {
        extend:{
            "border-radius": "12px",
        }
    }
}

/**
 * Remove Icon Button with 'subClick' prop 
 */
export default class RemoveButton extends Component {

    render() {
        return (
            <Grommet theme={customTheme}>
                <Button align="center" icon={<Subtract />} onClick={() => {this.props.subClick()}} hoverIndicator="#EAEAEA" />
            </Grommet>
        );
    }
}