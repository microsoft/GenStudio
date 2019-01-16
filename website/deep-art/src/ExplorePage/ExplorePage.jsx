import React, { Component } from 'react';
import styled from "styled-components";

import GenArt from './GenArt.jsx';
import ExplorePalette from './ExplorePalette.jsx';
import InfoArt from './InfoArt.jsx';

import {Box, Text, Grid, Paragraph} from 'grommet';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`
/**
 * Page for the Exploring feature
 * Pulls data from the URL in props.match.params
 */
export default class ExplorePage extends Component {
    constructor(props){

        super(props);

        this.state = {
            imgURL: '',
            apiData: {},
            genImg: 0,
            genSeed: []
        };

        this.addSeed = this.addSeed.bind(this);
        this.subSeed = this.subSeed.bind(this);

    };

    componentDidMount () {
        const { id } = this.props.match.params;

        //Eventually replaced with call to GAN
        const baseMetUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        let metApiUrl = baseMetUrl + id.toString();

        const Http = new XMLHttpRequest();
        Http.open("GET", metApiUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({
                        imgURL: response.primaryImage,
                        apiData: response
                    })

                    const imageToSeedUrl = "https://imagetoseed-met.azurewebsites.net/url"
                    const Http2 = new XMLHttpRequest();
                    Http2.open("GET", imageToSeedUrl);
                    let requestBody = new FormData();
                    requestBody.append("url", "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/70-water-lilies-claude-monet.jpg");
                    Http2.send(requestBody);
                    Http2.onreadystatechange = (e) => {
                        if (Http2.readyState === 4) {
                            try {
                                let response = JSON.parse(Http2.responseText);
                                let seed = [response.seed].toString();
                                seed = `[[${seed}]]`;
                                this.setState({
                                    genSeed: this.twoDArrayStringToOneDArray(seed)
                                });
                                this.getGenImage(seed);


                            } catch {
                                console.log('malformed request:' + Http2.responseText);
                            }
                        }
                    }
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    /**
     * Calls an API, sending a seed, and getting back an ArrayBuffer reprsenting that image
     * This function directly saves the ArrayBuffer to state
     * @param {string} seedArr - string version of a 1x512 array of floats between -1,1  
     */
    getGenImage(seedArr){
        const apiURL = 'http://artgan.eastus2.cloudapp.azure.com:8080/seed2image';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed', seedArr);

        Http.responseType = "arraybuffer"
        Http.open("POST", apiURL);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try{
                    let imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response)));
                    this.setState({genImg: imgData});

                } catch (e) {
                    console.log('malformed request:'+Http.responseText);
                }
            }
        }
    }

    /**
     * Converts a 2D array string into a 1D array of floats
     * @param {string} arrayString - string version of a 1x? array of floats
     * @returns {Float[]} - The 1D float array from arrayString
     */
    twoDArrayStringToOneDArray(arrayString){
        let numbers = arrayString.substring(2,arrayString.length -2); //cut off the "[[]]"
        let arrayNum = numbers.split(',').map(function(item) {
            return parseFloat(item);
        });
        return(arrayNum);
    }

    /**
     * Finds a difference vector between the genSeed and the otherSeed
     * @param {Float[]} genSeed - the current generated image seed
     * @param {Float[]} otherSeed - the other seed to frind the difference from
     * @param {Float} stepSize - The multiplyer on the difference vector 
     */
    findDiff(genSeed, otherSeed, stepSize=.1){
        let diffVec = [];
        for (let i = 0; i < 512; i++){
            let diff = ((genSeed[i] - otherSeed[i])*stepSize); //Magic number 10, works well
            diffVec.push(diff);
        }
        return(diffVec);
    }

    /**
     * Adds diffVec to genSeed, limits values to be between -1,1
     * @param {Float[]} genSeed - The current generated image seed
     * @param {Float[]} diffVec - A difference vector to add to diffVec
     */
    addVec(genSeed, diffVec){
        let newSeed = [];
        for (let i = 0; i < 512; i++){
            let newVal = genSeed[i] + diffVec[i];
            if (newVal > 1){
                newVal = 1;
            } else if (newVal < -1){
                newVal = -1;
            }
            newSeed.push(newVal);
        }
        return(newSeed);
    }

    /**
     * Subtracts diffVec from genSeed, limits values to be between -1,1
     * @param {Float[]} genSeed - The current generated image seed
     * @param {Float[]} diffVec - A difference vector to subtract from diffVec
     */
    subVec(genSeed, diffVec){
        let newSeed = [];
        for (let i = 0; i < 512; i++){
            let newVal = genSeed[i] - diffVec[i];
            if (newVal > 1){
                newVal = 1;
            } else if (newVal < -1){
                newVal = -1;
            }
            newSeed.push(newVal);
        }
        return(newSeed);
    }

    /**
     * Moves genSeed towards seed linearly, and generates the new image. Directly modifies state.
     * @param {Float[]} seed - 1x512 array
     */
    addSeed(seed){
        let diffVec = this.findDiff(this.state.genSeed, seed);
        let newSeed = this.addVec(this.state.genSeed, diffVec);
        this.setState({
            genSeed: newSeed
        });
        let strSeed = `[[${newSeed}]]`;
        this.getGenImage(strSeed);
    }

    /**
     * Moves genSeed away from seed linearly, and generates the new image. Directly modifies state.
     * @param {Float[]} seed - 1x512 array
     */
    subSeed(seed){
        let diffVec = this.findDiff(this.state.genSeed, seed);
        let newSeed = this.subVec(this.state.genSeed, diffVec);
        this.setState({
            genSeed: newSeed
        });
        let strSeed = `[[${newSeed}]]`;
        this.getGenImage(strSeed);
    }

    render(){
        return(
            <Grid
                areas={[
                    { name: 'left', start: [0, 0], end: [0, 1] },
                    { name: 'info', start: [1, 0], end: [1, 0] },
                    { name: 'explore', start: [1, 1], end: [1, 1] },
                    { name: 'right', start: [2, 0], end: [2, 1] },
                ]}
                columns={['flex','xlarge','flex']}
                rows={['small','large']}
                gap='small'
                style={{padding: '1rem'}}
            >
                <Box gridArea='info' direction='row' justify="center" align="center">
                    <Box direction='column' justify="center" pad="medium">
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"medium"}>
                        {this.state.apiData.title}
                        </Paragraph>
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"medium"}>
                        {this.state.apiData.objectDate}
                        </Paragraph>
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"medium"}>
                        Artist: {this.state.apiData.artistDisplayName}
                        </Paragraph>
                    </Box>
                    <InfoArt image={this.state.imgURL}/>
                </Box>
                <Box gridArea='explore' direction='row' align='center' justify="center">
                        <GenArt image={this.state.genImg}/>
                    
                    <Box>
                        <ExplorePalette addSeed={this.addSeed} subSeed={this.subSeed}/>
                    </Box>
                    
                </Box>
            </Grid>
        );
    }
}