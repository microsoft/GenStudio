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
                columns={["small", "small","small"]}
                rows={"meduim"}
                gap="medium"
                margin="40px"
            >
                {testData.map(tile => (
                    <Box border=
                        {{ color: "black", size: "3px" }}
                        round="small"
                        height="small"
                        width="small"
                    >
                        <Image
                            src={tile.img}
                            fit="cover"
                            style={{ zIndex: "-1"}}
                        />
                        <Box
                            direction="row"
                            alignSelf = "center"
                            margin="xsmall"
                        >
                            <RemoveButton/>
                            <AddButton/>
                        </Box>
                    </Box>
                ))}
            </Grid>
        );
    }
}