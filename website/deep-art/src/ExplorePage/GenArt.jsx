import React, { Component } from 'react';
import styled from "styled-components";
import { Box, Image} from 'grommet';
import vase from '../images/testVase.jpg';

export default class GenArt extends Component {
    condtructor(props){

    };

    render(){

        const ImageBox = () => (
            <Box height="medium" width="medium" border>
                <Image src={vase} fit="cover" />
            </Box>
          );

        return(
        <div>
            <ImageBox />
        </div>    
        );
    }
}