import React, { Component } from 'react';
import styled from "styled-components";

import { Box, Image} from 'grommet';

// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';

import Card from 'react-bootstrap/lib/Card';
import vase from '../images/testVase.jpg';

// const StyledCard = styled(Card)`
//     &&{
//         margin: 5vw;

//     }`

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