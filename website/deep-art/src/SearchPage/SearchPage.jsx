import React, { Component } from 'react';
import styled from "styled-components";

import SelectControl from './SelectControl.jsx';
import ResultArt from './ResultArt.jsx';

import { Box, Button, Grid, Paragraph, Text } from 'grommet';



import landscape from '../images/testLandscape.jpg';
import portrait from '../images/testPortrait.jpg';
import vase from '../images/testVase.jpg';
import error from '../images/testError.png';


export default class SearchPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedIndex: 0,
            selectedImage: 0,
            imgURLs: []
        };

        this.changeSelect = this.changeSelect.bind(this);
        this.changeSelectedImage = this.changeSelectedImage.bind(this);

        //this.objIDsToImages([69, 438099, 140, 298, 7198, 71297]);
    };

    componentDidMount(){
        this.objIDsToImages([69, 438099, 140, 298, 7198, 71297]);
    }

    changeSelect(index){
        this.setState({ selectedIndex: index });
        //Call CSV API and change imgURLs accordingly
    }

    changeSelectedImage(ID){
        this.setState({selectedImage: ID});
    }

    /**
     * 
     * @param {Int[]} objIDs - An array of object IDs from the met API to convert to an array of image urls
     * @return {String[]} - An array of image urls from the met API.
     */
    objIDsToImages(objIDs){
        
        const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        
        let apiURLs = objIDs.map(ID => (
            {url: baseURL+ID.toString(),
             id: ID}
        ));

        //console.log(apiURLs.toString());

        for (let i = 0; i < apiURLs.length; i++){
            const Http = new XMLHttpRequest();
            Http.open("GET", apiURLs[i].url);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4){
                    try {
                        let response = JSON.parse(Http.responseText);
    
                        this.setState((oldState) => {
                            return oldState.imgURLs.push(
                                {img: response.primaryImage,
                                 id: apiURLs[i].id} 
                                )
                        })
                    } catch (e) {
                        console.log('malformed request:' + Http.responseText);
                    }
                }

            }
        }
        //console.log(imgURLs.toString());
    }

    render(){

        //let result = this.genResult();
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
                columns={['flex','large','flex']}
                rows={['small','xsmall','large','xsmall']}
                gap='small'
            >
                <Box gridArea='desc'>
                    <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"large"}>
                    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
                    </Paragraph>
                </Box>
                <Box gridArea='tags' direction='row' align='center' justify="center">
                    <Text>
                        Choose a category:
                    </Text>
                    <SelectControl/>
                </Box>
                <Box gridArea='select'>
                    <ResultArt images={this.state.imgURLs} selectedImage={this.state.selectedImage} selectImage={this.changeSelectedImage} />
                </Box>
                <Box gridArea='buttons'>
                    <Box direction='row' style={{justifyContent: 'space-around'}}>
                        <Box>
                            <Button label='Generate Image' href={"/explore/"+this.state.selectedImage.toString()} />
                        </Box>
                        <Box>
                            <Button label='Explore Similar'/>
                        </Box>
                    </Box>

                    
                </Box>
                <Box gridArea='left'/>
                <Box gridArea='right' />
            </Grid>
        );
    }
}