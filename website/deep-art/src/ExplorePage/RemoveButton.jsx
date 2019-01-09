import React, { Component } from 'react';
import styled from "styled-components";


import { Box, Button} from 'grommet';
import { Subtract } from "grommet-icons";

export default class RemoveButton extends Component {
    condtructor(props){

    };

    render(){
        return(
            <Box align="center" pad="large">
                <Button icon={<Subtract />} hoverIndicator />
            </Box>
        );
    }
}