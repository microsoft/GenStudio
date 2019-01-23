import React, { Component } from 'react';
import { Box, Button, Image} from 'grommet';

/**
 * The box containing the generated image
 * 'image' prop: The generated image, in base64 encoded ArrayBuffer format
 */
export default class GenArt extends Component {
    constructor(props){
        super(props);

        this.state = {
            image: 0,
        }
    };
    render(){

        const ImageBox = () => (
            <Box
                height="medium"
                width="medium"
                border=
                {{ color: "black", size: "4px" }}
                round="small"
                style={{ padding: "0px", marginTop: "10px", marginLeft: "10px",}}
            >

                <Image src={"data:image/jpeg;base64," + this.props.image} fit="cover" style={{zIndex: "-1"}} />
            </Box>
          );

        return(
        <Box direction="column" justify="between">
            <ImageBox />
            <Box pad="medium">
                <Button label="Explore Similar" href={'/search'}/>
            </Box>
        </Box>    
        );
    }
}