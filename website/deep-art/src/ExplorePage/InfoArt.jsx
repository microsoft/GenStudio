import React, { Component } from 'react';
import { Box, Image} from 'grommet';

export default class InfoArt extends Component {
    constructor(props){
        super(props);
    };

    render(){

        const ImageBox = () => (
            <Box
                height="small"
                width="small"
                border=
                {{ color: "black", size: "3px" }}
                round="small"
                style={{ padding: "0px", marginTop: "10px", marginLeft: "10px",}}
            >
                <Image src={this.props.image} fit="cover" style={{ zIndex: "-1"}} />
            </Box>
          );

        return(
            <ImageBox />   
        );
    }
}