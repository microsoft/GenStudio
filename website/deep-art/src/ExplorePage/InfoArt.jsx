import React, { Component } from 'react';
import { Box, Image} from 'grommet';

export default class InfoArt extends Component {
    constructor(props){
        super(props);
    };

    render(){

        const ImageBox = () => (
            <Box
                height="medium"
                width="medium"
                border=
                {{ color: "black", size: "3px" }}
                round="small"
                style={{ padding: "5px", marginTop: "10px", marginLeft: "10px", zIndex: "-1"}}
            >
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