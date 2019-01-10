import React, { Component } from 'react';
import { grommet } from "grommet/themes";

import { Box, Button, Grommet} from 'grommet';
import { Add } from "grommet-icons";


export default class AddButton extends Component {
    condtructor(props){

    };

    render(){
        return (
            <Grommet theme={grommet}>
                <Box >
                <Button icon={<Add />} hoverIndicator />
                </Box>
            </Grommet>
        );
    }
}