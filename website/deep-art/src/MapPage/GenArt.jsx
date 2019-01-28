import React, { Component } from 'react';
import { Box, Button, Image} from 'grommet';
import { saveAs } from 'file-saver';

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
        this.saveImage = this.saveImage.bind(this);
    };

    saveImage(){
        let number = Math.floor(Math.random()*(10000));
        let file = new File([this.props.data], "image"+number.toString()+".jpeg", {type: "image/jpeg"});
        saveAs(file);

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
            {/* <Box pad="medium">
                <Button label="Explore Similar" href={'/search'}/>
                <Button label="Save Image" onClick={this.saveImage}/>
            </Box> */}
        </Box>    
        );
    }
}