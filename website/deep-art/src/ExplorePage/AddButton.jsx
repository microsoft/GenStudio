import React, { Component } from 'react';
import styled from "styled-components";
import { grommet } from "grommet/themes";

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

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