import React, { Component } from 'react';
import styled from "styled-components";

import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import testData from './testData.js';

const GridDiv = styled.div`
    width: 40vw;
    margin: 5vw;
    `

const ButtonDiv = styled.div`
    display: flex;
    flex flow: row wrap;
    justify-content: space-between;
    `

export default class ExplorePalette extends Component {
    condtructor(props){

    };

    render(){
        return(
            <GridDiv>
                <GridList cellHeight={'10vh'} cols={3} spacing={20}>
                    {testData.map(tile => (
                        <GridListTile key={tile.img} cols={tile.cols || 1}>
                            <Card>
                                <CardMedia
                                    image={tile.img}
                                    title={tile.title}
                                    style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
                                />
                                <CardContent>
                                    <ButtonDiv>
                                        <RemoveButton/>
                                        <AddButton/>
                                    </ButtonDiv>
                                </CardContent>
                            </Card>
                        </GridListTile>
                    ))}
                </GridList>
            </GridDiv>
        );
    }
}