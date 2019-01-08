import React, { Component } from 'react';
import styled from "styled-components";

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

export default class AddButton extends Component {
    condtructor(props){

    };

    render(){
        return(
            <IconButton>
                <AddIcon/>
            </IconButton>
        );
    }
}