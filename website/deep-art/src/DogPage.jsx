import React, { Component } from 'react';
import styled from "styled-components";

import { Button, Card, CardImg } from 'reactstrap';

//import Card from '@material-ui/core/Card';
//import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
//import Button from '@material-ui/core/Button';


const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`
const Http = new XMLHttpRequest();
const url = 'https://dog.ceo/api/breeds/image/random';
let imageUrl = "placeholder";

export default class DogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: "placeholder"
        };
        this.getDogPicture();
    };

    getDogPicture() {
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            try {
                var imageURL = JSON.parse(Http.responseText).message;
                this.setState({ imageUrl: imageURL });
                this.render();
            } catch (e) {
                console.log('malformed request:' + Http.responseText);
            }
        }
    }

    render() {
        return (
            
            <div>
                <Button color="primary">primary</Button>{' '}
                <Button color="secondary">secondary</Button>{' '}
                <Button color="success">success</Button>{' '}
                <Button color="info">info</Button>{' '}
                <Button color="warning">warning</Button>{' '}
                <Button color="danger">danger</Button>{' '}
                <Button color="link">link</Button>
            </div>
            
            
            );
        return(
            <ColumnsDiv>
                <Card>
                    <CardImg
                        src={this.state.imageUrl}
                        alt="dog?"
                        style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
                    />
                </Card>
                <Button color="primary">
                    SHOW ME DOG
                </Button>{' '}
            </ColumnsDiv>
        );
    }
}