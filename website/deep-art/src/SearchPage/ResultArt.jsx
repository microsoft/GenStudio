import React, { Component } from 'react';
import styled from "styled-components";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const StyledCard = styled(Card)`
    &&{
        margin: 10vw;

    }`

export default class ResultArt extends Component {
    constructor(props){
        super(props);
    };

    render(){
        return(
        <div>
            <StyledCard>
                <CardMedia
                    image={this.props.image}
                    title={this.props.title}
                    style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
                />
            </StyledCard>
        </div>    
        );
    }
}