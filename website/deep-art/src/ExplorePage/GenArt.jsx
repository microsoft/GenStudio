import React, { Component } from 'react';
import styled from "styled-components";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const StyledCard = styled(Card)`
    &&{
        margin: 10vw;

    }`

export default class GenArt extends Component {
    condtructor(props){

    };

    render(){
        return(
        <div>
            <StyledCard>
                <CardMedia
                    image={require('../images/testVase.jpg')}
                    title="test vase"
                    style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
                />
            </StyledCard>
        </div>    
        );
    }
}