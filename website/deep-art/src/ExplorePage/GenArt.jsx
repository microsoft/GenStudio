import React, { Component } from 'react';
import { Box, Button, Image} from 'grommet';

export default class GenArt extends Component {
    constructor(props){
        super(props);

        this.state = {
            image: 0
        }
    };

    render(){
        console.log("Hello\n"+this.props.image);
        let imgBlob = new Blob([this.props.image],{type: 'image/jpeg'});
        let fr = new FileReader();
        let img = null;
        fr.onload = function(e) {
            console.log("Monkey"+e.target.result);
            img = e.target.result;
        }
        fr.readAsDataURL(imgBlob);
        console.log("Hawk "+fr.result);




        const ImageBox = () => (
            <Box
                height="medium"
                width="medium"
                border=
                {{ color: "black", size: "3px" }}
                round="small"
                style={{ padding: "5px", marginTop: "10px", marginLeft: "10px", zIndex: "-1"}}
            >
                <Image src={img} fit="cover" />
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