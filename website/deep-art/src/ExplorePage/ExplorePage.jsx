import React, { Component } from 'react';
import styled from "styled-components";

import GenArt from './GenArt.jsx';
import ExplorePalette from './ExplorePalette.jsx';
import InfoArt from './InfoArt.jsx';
import APIHelper from '../APIHelper.jsx';

import {Box, Text, Grid, Paragraph} from 'grommet';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`
const apiHelper = new APIHelper();
const SEED_LENGTH = 140;

/**
 * Page for the Exploring feature
 * Pulls data from the URL in props.match.params
 */
export default class ExplorePage extends Component {

    constructor(props) {    
        super(props);
        this.state = {
            imgData: '',
            apiData: {},
            genImg: 0,
            genSeed: [],
            genLabel: [],
            imgObjectsExplore: []
        };

        this.addSeed = this.addSeed.bind(this);
        this.subSeed = this.subSeed.bind(this);

    };

    /**
     * sets state.imgObjectsExplore to contain a json object for each ID provided. object format: {img, id, key}
     * @param {Int[]} objIDs - an array of art IDs
     */
    objIDsToImages(objIDs) {

        const baseURL = 'https://deepartstorage.blob.core.windows.net/public/thumbnails2/';

        let apiURLs = objIDs.map(ID => (
            {
                url: baseURL + ID.toString()+".jpg",
                id: ID
            }
        ));

        for (let i = 0; i < apiURLs.length; i++) {
            const Http = new XMLHttpRequest();
            Http.responseType = "arraybuffer";
            Http.open("GET", apiURLs[i].url);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4) {
                    try {
                        //console.log(Http.response);
                        this.setState((oldState) => {
                            return oldState.imgObjectsExplore.push(
                                {
                                    img: btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response))),
                                    id: apiURLs[i].id,
                                    key: i
                                }
                            )
                        })
                    } catch (e) {
                        console.log('malformed request:' + Http.responseText);
                    }
                }
            }
        }
    }

    componentDidMount() {
        let url = this.props.match.params.id.toString();
        url = decodeURIComponent(url);
        let selectedArt = url.split('&')[0].slice(4);
        let artArr = url.split('&')[1].slice(4);
        artArr = JSON.parse(artArr);
        const id = selectedArt;
        this.objIDsToImages(artArr);

        this.firstTimeGenImage(id);
    }

    /**
     * Sets up component state the first time for the selected image represented by id
     * @param {int} id - object ID of the initial piece of art to generate an image for
     */
    firstTimeGenImage(id){

        const baseMetUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        let metApiUrl = baseMetUrl + id;

        const Http = new XMLHttpRequest();
        Http.open("GET", metApiUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({
                        imgData: response.primaryImage,
                        apiData: response
                    })

                    const imageToSeedUrl="https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
                    const fileName = response.objectID.toString()+".json";
                    const Http2 = new XMLHttpRequest();
                    Http2.open("GET", imageToSeedUrl+fileName);
                    Http2.send();
                    Http2.onreadystatechange = (e) => {
                        if (Http2.readyState === 4) {
                            try {
                                let response = JSON.parse(Http2.responseText);
                                let seed = [response.latents].toString();
                                seed = `[[${seed}]]`;
                                let label = response.labels;
                                this.setState({
                                    genSeed: this.twoDArrayStringToOneDArray(seed),
                                    genLabel: response.labels
                                });
                                this.getGenImage(seed, label);


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
     * @param {string} seedArr - string version of a 1xSEED_LENGTH array of floats between -1,1  
     */
    getGenImage(seedArr, labelArr) {

        let max = labelArr.reduce(function(a, b) {
            return Math.max(a, b);
        });
        let maxIndex = labelArr.indexOf(max);
        // let labels = this.state.genLabel.toString();
        // labels = `[[${labels}]]`;

        const apiURL = 'https://methack-api.azure-api.net/biggan/category?subscription-key=43d3f563ea224c4c990e437ada74fae8';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed',seedArr);
        //data.append('labels', labels);
        data.append('category', maxIndex.toString());

        Http.responseType = "arraybuffer";
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
        for (let i = 0; i < genSeed.length; i++){
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
        for (let i = 0; i < genSeed.length; i++){
            let newVal = genSeed[i] - diffVec[i];
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
        for (let i = 0; i < genSeed.length; i++){
            let newVal = genSeed[i] + diffVec[i];
            newSeed.push(newVal);
        }
        return(newSeed);
    }

    /**
     * Moves genSeed towards seed linearly, and generates the new image. Directly modifies state.
     * @param {Float[]} seed - 1xSEED_LENGTH array
     */
    addSeed(seed, label){
        let diffSeed = this.findDiff(this.state.genSeed, seed);
        let newSeed = this.addVec(this.state.genSeed, diffSeed);

        let diffLabel = this.findDiff(this.state.genLabel, label);
        let newLabel = this.addVec(this.state.genLabel, diffLabel);
        this.setState({
            genSeed: newSeed,
            genLabel: newLabel
        });
        let strSeed = `[[${newSeed}]]`;

        this.getGenImage(strSeed, newLabel);
    }

    /**
     * Moves genSeed away from seed linearly, and generates the new image. Directly modifies state.
     * @param {Float[]} seed - 1xSEED_LENGTH array
     */
    subSeed(seed, label){
        let diffSeed = this.findDiff(this.state.genSeed, seed);
        let newSeed = this.subVec(this.state.genSeed, diffSeed);

        let diffLabel = this.findDiff(this.state.genLabel, label);
        let newLabel = this.addVec(this.state.genLabel, diffLabel);
        this.setState({
            genSeed: newSeed,
            genLabel: newLabel
        });
        let strSeed = `[[${newSeed}]]`;
        this.getGenImage(strSeed, newLabel);
    }

    render() {
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
                    <InfoArt image={this.state.imgData}/>
                </Box>
                <Box gridArea='explore' direction='row' align='center' justify="center">
                        <GenArt image={this.state.genImg}/>
                    
                    <Box>
                        <ExplorePalette images={this.state.imgObjectsExplore} addSeed={this.addSeed} subSeed={this.subSeed}/>
                    </Box>
                    
                </Box>
            </Grid>
        );
    }
}