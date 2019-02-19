import React, { Component } from 'react';
import { Box, Image} from 'grommet';

/**
 * The box containing the normal art Image
 * 'image' prop: the image to be displayed, in url formal
 */
export default class InfoArt extends Component {

    render(){

        const ImageBox = () => (
            <Box
                height="small"
                width="small"
                round="small"
                style={{ padding: "0px", marginTop: "10px", marginLeft: "10px",}}
            >
                <Image src={this.props.image} fit="cover" style={{ height: "100%", zIndex: "-1"}} />
            </Box>
          );

        return(
            <ImageBox />   
        );
    }
}