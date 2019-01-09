import React, { Component } from 'react';
import styled from "styled-components";
import { grommet } from "grommet/themes";

import { Box, Button, Grommet} from 'grommet';
import { Subtract } from "grommet-icons";

export default class RemoveButton extends Component {
    condtructor(props){

    };

    render() {
        return (
            <Grommet theme={grommet}>
                <Box>
                    <Button align="center" icon={<Subtract />} hoverIndicator />
                </Box>
            </Grommet>
        );
    }
}