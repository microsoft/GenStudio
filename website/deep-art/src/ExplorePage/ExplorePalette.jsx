import React, { Component } from 'react';
import styled from "styled-components";

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import testData from './testData.js';

const GridDiv = styled.div`
    width: 40vw;
    margin: 5vw;
    `

export default class ExplorePalette extends Component {
    condtructor(props){

    };

    render(){
        return(
            <GridDiv>
                <GridList cellHeight={160} cols={3}>
                    {testData.map(tile => (
                        <GridListTile key={tile.img} cols={tile.cols || 1}>
                            <img src={tile.img} alt={tile.title} />
                        </GridListTile>
                    ))}
                </GridList>
            </GridDiv>
        );
    }
}