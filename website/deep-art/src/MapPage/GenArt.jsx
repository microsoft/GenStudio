import React, { Component } from 'react';
import { Box, Button, Image} from 'grommet';
import { saveAs } from 'file-saver';

import { Redirect } from 'react-router-dom';

/**
 * The box containing the generated image
 * 'image' prop: The generated image, in base64 encoded ArrayBuffer format
 */
export default class GenArt extends Component {
    constructor(props){
        super(props);

        this.state = {
            image: 0,
            objID: 0,
            redirect: false
        }
        this.saveImage = this.saveImage.bind(this);
        this.getSimilarArtID = this.getSimilarArtID.bind(this);
    };

    saveImage(){
        let number = Math.floor(Math.random()*(10000));
        let file = new File([this.props.data], "image"+number.toString()+".jpeg", {type: "image/jpeg"});
        
        saveAs(file);

    };

    getSimilarArtID(){
        //let file = new File([this.props.data], "image.jpeg", {type: "image/jpeg"});

        let file = this.props.image;

        //const apiURL = 'https://imagedocker2.azurewebsites.net/FindSimilarImages/Byte';
        //const apiURL = 'https://metimagesearch.azurewebsites.net/neighbors?neighbors=1';
        const apiURL = 'https://methack-api.azure-api.net/ImageSimilarity/FindSimilarImages/Byte'
        const key = '?subscription-key=43d3f563ea224c4c990e437ada74fae8'
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('image', file);

        Http.open("POST", apiURL+key);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {

                    let response = JSON.parse(Http.responseText);
                    let id = response.results[0].ObjectID;
                    if (id === undefined || id === null){
                        id = 0;
                    }

                    this.setState({
                        objID: id,
                        redirect: true
                    })
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    render(){

        const ImageBox = () => (
            <Box
                height="medium"
                width="medium"
                // border=
                // {{ color: "black", size: "4px" }}
                round="small"
                style={{ padding: "0px"}}
            >

                <Image src={"data:image/jpeg;base64," + this.props.image} fit="cover" style={{zIndex: "-1"}} />
            </Box>
          );
        
        if (this.state.redirect){
            let link = `/search/${this.state.objID}`;
            return (<Redirect push to={link}/>)
        } else {
            return(
                <Box direction="column" align="center" justify="center">
                    <ImageBox />
                    <Box pad="medium">
                        <Button label="Explore Similar" onClick={this.getSimilarArtID}/>
                        <Button label="Save Image" onClick={this.saveImage}/>
                    </Box>
                </Box>

            );
        }


    }
}