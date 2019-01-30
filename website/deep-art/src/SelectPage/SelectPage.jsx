import React, { Component } from 'react';
import styled from "styled-components";
import SelectControl from './SelectControl.jsx';
import ResultArt from './ResultArt.jsx';
import { Box, Button, Grid, Paragraph, Text } from 'grommet';


export default class SelectPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            curatedImages: {
                'Vases': [9583, 9512, 9408, 9405, 9402, 9397, 9393, 153112, 2556, 9396,
                        9232, 9233, 9249, 9363, 9260, 9252, 9297, 9250, 9299],
                'Armors': [22270,22408,22848,23143,25114,34652,35652,24937],
                'Teapots': [8348, 8354, 8355, 8375, 8385, 8391, 8396, 8401, 8412, 8423,
                        42323, 193189, 194634, 197523, 198032],
                'Ewers': [201671, 202194, 232038, 324830, 324917, 544501, 751402,
                    446900, 445269, 200171, 200117, 195775, 194243, 49208,
                    42370, 447077, 448260, 449058, 460715, 453457, 453306, 452036,
                    4551609, 447072, 444967, 44810],
                'Purses': [84595,116964,116963,116963,116944,116884,79226,70467],
                'Goblets': [207897, 4081, 4086, 4101, 4102, 4124, 187987, 239826],
                'landingpage': [42447, 42447, 42447, 42447, 42447, 42447, 42447,
                    42447, 42447, 42447, 42447, 42447],
                'preppedPairs1': [42447, 249414, 249414, 249414, 249414, 249414, 249414],
                'preppedPairs2': [42447, 249414, 42447, 249414, 249414, 249414, 249414]

            }
,
            selectedIndex: 0,
            selectedImage: {
                id: 0,
                key: -1
            },
            imgObjects: [],
            categorySelected: false
        };

        this.changeSelectedImage = this.changeSelectedImage.bind(this);
        this.getImageIDs = this.getImageIDs.bind(this);
        this.clearOldImages = this.clearOldImages.bind(this);
    };

    //these are the initial images that are displayed when the page loads
    componentDidMount(){
        this.objIDsToImages(this.state.curatedImages['landingpage']);
    }

    changeSelectedImage(key, ID) {
        //Unclear if this is a better system or not
        if (ID === this.state.selectedImage){
            this.setState({
                selectedImage:
                {
                    id: 0,
                    key: -1
                }
            });
        } else {
            this.setState({
                selectedImage:
                {
                    id: ID,
                    key: key
                }
            });
        }
    }

    getImageIDs(imageIDs) {
        this.objIDsToImages(imageIDs);
    }

    clearOldImages() {
        this.state.categorySelected = true;
        this.state.imgObjects = []; 
    }

    /**
     * loads the images of the specified object IDs from the Met and saves it
     * into this.state.imgObjects
     * @param {Int[]} objIDs - An array of object IDs from the met API to convert to an array of image urls
     * @return {String[]} - An array of image urls from the met API.
     */
    objIDsToImages(objIDs) {
        const baseURL = 'https://deepartstorage.blob.core.windows.net/public/thumbnails3/';
        
        let apiURLs = objIDs.map(ID => (
            {url: baseURL+ID.toString(),
             id: ID}
        ));
        for (let i = 0; i < apiURLs.length; i++){
            const Http = new XMLHttpRequest();
            Http.responseType = "arraybuffer";
            Http.open("GET", apiURLs[i].url);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4){
                    try {
                        this.setState((oldState) => {                           
                            return oldState.imgObjects.push(
                                {
                                    img: btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response))),
                                    id: apiURLs[i].id,
                                    key: i
                                });
                        });
                    } catch (e) {
                        console.log('malformed request:' + Http.responseText);
                    }
                }
            }
        }
    }

    generateArtUrlSuffix() {
        let urlBase = "/map/";
        let idList = [];
        if (this.state.categorySelected) {
            idList = this.state.imgObjects.slice(0, 7).map(ob => ob.id);
        } else {
            //todo: make a random selection between the pairs
            //currently just the same ones each time
            if (this.state.selectedImage.id in this.state.curatedImages['preppedPairs1']) {
                idList = this.state.curatedImages['preppedPairs1'];
            } else {
                idList = this.state.curatedImages['preppedPairs2'];
            }
            
        }
        
        let url = "?id=" + this.state.selectedImage.id.toString()
            + "&ids=[" + idList.toString() + "]";
        //console.log("url: " + url);
        url = encodeURIComponent(url);
        return urlBase + url;
    }

    render() {
        return(
            <Grid
                areas={[
                    { name: 'left', start: [0, 0], end: [0, 3] },
                    { name: 'desc', start: [1, 0], end: [1, 0] },
                    { name: 'tags', start: [1, 1], end: [1, 1] },
                    { name: 'select', start: [1, 2], end: [1, 2] },
                    { name: 'buttons', start: [1, 3], end: [1, 3]},
                    { name: 'right', start: [2, 0], end: [2, 3] },
                ]}
                columns={['flex','80rem','flex']}
                rows={['5rem','3rem','flex','xsmall']}
                gap='small'
            >
                <Box gridArea='desc' >
                    <Paragraph
                        style={{ textAlign: 'center', marginTop: '40px' }}
                        alignSelf={"center"}
                        size={"large"}
                    >
                    Select an image to enter the AI studio
                    </Paragraph>
                </Box>
                <Box gridArea='tags' direction='row' align='center' justify="center">
                    <Text size={"large"}>
                        Filter by category:
                    </Text>
                    <SelectControl
                        sendObjectIds={this.getImageIDs}
                        clearOldImages={this.clearOldImages}
                        curatedImages={this.state.curatedImages}
                    />
                </Box>
                <Box gridArea='select'>
                    <ResultArt
                        images={this.state.imgObjects}
                        selectedImage={this.state.selectedImage}
                        selectImage={this.changeSelectedImage}
                        categorySelected={this.state.categorySelected}
                    />
                </Box>
                <Box gridArea='buttons'>
                    <Box direction='row' style={{justifyContent: 'space-around'}}>
                        <Box>
                            <Button label='Generate' style={{textDecoration: "none", fontWeight: "500"}} href={this.generateArtUrlSuffix()} />
                        </Box>
                        {/* <Box>
                            <Button label='Explore Similar' style={{textDecoration: "none"}} href={'/search/'+this.state.selectedImage.toString()}/>
                        </Box> */}
                    </Box> 
                </Box>
                <Box gridArea='left'/>
                <Box gridArea='right' />
            </Grid>
        );
    }
}