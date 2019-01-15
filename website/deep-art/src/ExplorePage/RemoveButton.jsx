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

export default class RemoveButton extends Component {
    condtructor(props){

    };



    render() {
        return (
            <Grommet theme={customTheme}>
                <Button align="center" icon={<Subtract />} hoverIndicator="#b6802b" />
            </Grommet>
        );
    }
}