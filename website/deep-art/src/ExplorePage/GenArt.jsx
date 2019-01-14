import React, { Component } from 'react';
import { Box, Button, Image} from 'grommet';

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
                {{ color: "black", size: "3px" }}
                round="small"
                style={{ padding: "5px", marginTop: "10px", marginLeft: "10px", zIndex: "-1"}}
            >

                <Image src={"data:image/jpeg;base64," + this.props.image} fit="cover" />
            </Box>
          );

        return(
        <Box direction="column" justify="between">
            <ImageBox />
            <Box pad="medium">
                <Button label="Explore Similar"/>
            </Box>
        </Box>    
        );
    }
}