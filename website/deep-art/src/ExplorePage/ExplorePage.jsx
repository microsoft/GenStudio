import React, { Component } from 'react';
import styled from "styled-components";

import GenArt from './GenArt.jsx';
import ExplorePalette from './ExplorePalette.jsx';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`

export default class ExplorePage extends Component {
    constructor(props){

        super(props);

        this.state = {
            imgURL: '',
        };

    };

    componentDidMount () {
        const { id } = this.props.match.params;

        //Eventually replaced with call to GAN
        const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        let apiURL = baseURL+id.toString();

        const Http = new XMLHttpRequest();
        Http.open("GET", apiURL);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try {
                    let response = JSON.parse(Http.responseText);

                    this.setState({
                        imgURL: response.primaryImage
                    })
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    render(){
        return(
            <ColumnsDiv>
                <GenArt image={this.state.imgURL}/>
                <ExplorePalette/>
            </ColumnsDiv>
        );
    }
}