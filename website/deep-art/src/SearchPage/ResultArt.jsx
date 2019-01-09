import React, { Component } from 'react';
import { Box, Image} from 'grommet';
import styled from "styled-components";

const GridWrapper = styled(Box)`
    flex-grow: 1;
    direction: row;
    align-items: center;
    padding-top: 2rem;      
`

export default class ResultArt extends Component {
    constructor(props){
        super(props);
    };



    render(){

        const ImageBox = () => (
            <Box width="large" height="large" elevation="small">
                <Image src={this.props.image} fit="contain" />
            </Box>
          );

        return(
            <GridWrapper>
                <ImageBox />
            </GridWrapper>    
        );
    }
}