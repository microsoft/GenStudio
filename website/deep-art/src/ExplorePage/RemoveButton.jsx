import React, { Component } from 'react';
import styled from "styled-components";

import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';

export default class RemoveButton extends Component {
    condtructor(props){

    };

    render(){
        return(
            <IconButton>
                <RemoveIcon/>
            </IconButton>
        );
    }
}