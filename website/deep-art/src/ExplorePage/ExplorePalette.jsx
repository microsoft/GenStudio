import React, { Component } from 'react';
import styled from "styled-components";
import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';
import { Box, Button, Grid, Text, Image} from 'grommet';
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
            <Grid
                columns={["medium","medium","medium"]}
                rows={"medium"}
                gap="small"
            >
                {testData.map(tile => (
                    <Box>
                        <Box>
                            <Image src={tile.img} fit="cover" />
                        </Box>
                        <Box>
                            <RemoveButton/>
                            <AddButton/>
                        </Box>
                    </Box>
                ))}
            </Grid>
        );
    }
}