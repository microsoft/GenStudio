import React, { Component } from 'react';
import styled from "styled-components";

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { Box, Button} from 'grommet';
import { Add } from "grommet-icons";


export default class AddButton extends Component {
    condtructor(props){

    };

    render(){
        return(
            <Box align="center" pad="large">
                <Button icon={<Add />} hoverIndicator />
            </Box>
        );
    }
}