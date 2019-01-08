import React, { Component } from 'react';
import styled from "styled-components";

import GenArt from './GenArt.jsx';
import ExplorePalette from './ExplorePalette.jsx';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`

export default class ExplorePage extends Component {
    condtructor(props){

    };

    render(){
        return(
            <ColumnsDiv>
                <GenArt/>
                <ExplorePalette/>
            </ColumnsDiv>
        );
    }
}