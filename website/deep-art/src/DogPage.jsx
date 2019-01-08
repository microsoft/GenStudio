import React, { Component } from 'react';
import styled from "styled-components";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`

export default class DogPage extends Component {
    condtructor(props){

    };

    render(){
        return(
            <ColumnsDiv>
                <Card>
                    <CardMedia
                        image={require('./images/testVase.jpg')}
                        title="test vase"
                        style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
                    />
                </Card>
                <Button>
                    SHOW ME DOG
                </Button>
            </ColumnsDiv>
        );
    }
}