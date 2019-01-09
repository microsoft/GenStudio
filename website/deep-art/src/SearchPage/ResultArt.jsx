import React, { Component } from 'react';
import { Box, Image} from 'grommet';
import styled from "styled-components";

// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';

import Card from 'react-bootstrap/lib/Card';

// const StyledCard = styled(Card)`
//     &&{
//         margin: 10vw;

//     }`




export default class ResultArt extends Component {
    constructor(props){
        super(props);
    };

    render(){

        const ImageBox = () => (
            <Box height="medium" width="medium" border>
                <Image src={this.props.image} fit="cover" />
            </Box>
          );

        return(
        <div>
            <ImageBox />
        </div>    
        );
    }
}