import React, { Component } from 'react';
import { Box, Button, Image, Text} from 'grommet';
import { saveAs } from 'file-saver';

import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        this.coordToCantorPair = this.coordToCantorPair.bind(this);
    };

    saveImage(){
        let number = Math.floor(Math.random()*(10000));
        let file = new File([this.props.data], "image"+number.toString()+".jpeg", {type: "image/jpeg"});
        
        saveAs(file);

    };

    coordToCantorPair(x,y){
        let intX = x*1000;
        let intY = y*1000;
        let pairing = .5*(intX+intY)*(intX+intY+1)+intY;
        return pairing;
    }

    getSimilarArtID(){
        //let file = new File([this.props.data], "image.jpeg", {type: "image/jpeg"});

        let file = this.props.image;

        //const apiURL = 'https://imagedocker2.azurewebsites.net/FindSimilarImages/Byte';
        //const apiURL = 'https://metimagesearch.azurewebsites.net/neighbors?neighbors=1';
        const apiURL = 'https://methack-api.azure-api.net/ImageSimilarity/FindSimilarImages/Byte'
        const key = '?subscription-key=43d3f563ea224c4c990e437ada74fae8&neighbors=1'
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

        let loadOrImage = (this.props.image === 0 || this.props.image === null || this.props.image === undefined) ? <CircularProgress /> : <ImageBox />;
        let coords = (this.props.point === null) ? "" : <Text size={"medium"} color={"#6A6A6A"} style={{ fontWeight: "600", fontFamily: "Courier"}}>{`[ ${this.props.point[0]} , ${this.props.point[1]} ]`}</Text>;
        let ID = (this.props.point === null) ? "" : <Text size={"medium"} color={"#6A6A6A"} style={{ fontWeight: "600", fontFamily: "Courier"}}>{`ID: ${this.coordToCantorPair(this.props.point[0], this.props.point[1])}`}</Text>;
        if (this.state.redirect){
            let link = `/search/${this.state.objID}`;
            return (<Redirect push to={link}/>)
        } else {
            return(
                <Box direction="column" align="center" justify="center">
                    {/* <ImageBox /> */}
                    {loadOrImage}
                    <Box style={{flexFlow: "column wrap", alignSelf:"start"}}>
                        {coords}
                        {ID}
                    </Box>
                    <Box pad="medium">
                        <Button label="Explore Similar" onClick={this.getSimilarArtID}/>
                        {/* <Button label="Save Image" onClick={this.saveImage}/> */}
                    </Box>
                </Box>

            );
        }


    }
}