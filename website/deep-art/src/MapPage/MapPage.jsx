import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import GenArt from './GenArt.jsx';
import { Box} from 'grommet';

export default class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                data: [],
                layout: {},
                images: {},
                imgObjectsExplore: [],
                imgData: '',
                apiData: {},
                genImg: 0,
                genSeed: [],
                genLabel: [],
                config: {},
                mouseCoords: [],
                neighborCoords: []
            };
        this.generateInterpSeed = this.generateInterpSeed.bind(this);
        this.setCoords = this.setCoords.bind(this);
        this.coordsToLatentLabel = this.coordsToLatentLabel.bind(this);
    }

    /**
     * Gets the images of the art to be shown on the map
     */
    getImages() {
    
        let paintingIds = this.state.imgObjectsExplore.map(obj => obj.id).slice(0, 5);
        //NOTE: currently images on the search page aren't all on the blob, so we are  
        // hardcoding the painting Ids until we can know all relevant Ids exist on the blob
        paintingIds = [22270, 22408, 22848, 23143, 35652];//, 202194, 324830, 324917, 544501]; //[1002, 10024, 10025, 10026, 10028];

        //this prevents an infinite loop of reloading in the render() fn
        //data needs to be loaded after ObjectIds guaranteed to be loaded, but only once
        if (Object.keys(this.state.images).length === 0) {
            this.populateImageSeeds(paintingIds);
        }

        let thumbnailRoot = "https://deepartstorage.blob.core.windows.net/public/thumbnails4/";
        let paintingUrls = paintingIds.map(id => thumbnailRoot + id.toString() + ".jpg");
        let imageProps = {
            "xref": "x",
            "yref": "y",
            "sizex": 0.2,
            "sizey": 0.2,
            "xanchor": "left",
            "yanchor": "top",
            "layer": "below"
        };
        let locations = [[0.2, 0.8],[0.4, 0.4],[0.8, 0.6],[1.1, 0.8],[0.6, 1.0]];
        let images = paintingUrls.map((url, i) => Object.assign(
            {
                "source": url,
                "x": locations[i][0],
                "y": locations[i][1]
            },
            imageProps));
            
        return images;
    }

    /**
     * Given a list of art ID's, direct sets 'images' state to be {id: {latents, labels}}
     * @param {Int[]} paintingIds - Array of art ID's
     */
    populateImageSeeds(paintingIds){
        let imageIDs = paintingIds
        const imageToSeedUrl="https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
        for (let i =0; i<imageIDs.length; i++){
            const fileName = imageIDs[i]+".json";
            const Http = new XMLHttpRequest();
            Http.open("GET", imageToSeedUrl+fileName);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4) {
                    try {

                        let response = JSON.parse(Http.responseText);
                        let imagesString = JSON.stringify(this.state.images);
                        let imagesCopy = JSON.parse(imagesString);

                        imagesCopy[imageIDs[i]] = { latents: [], labels: [] };
                        imagesCopy[imageIDs[i]].latents = response.latents;
                        imagesCopy[imageIDs[i]].labels = response.labels;

                        this.setState({
                            images: imagesCopy
                        });

                    } catch {
                        console.log('malformed request:' + Http.responseText);
                    }
                }
            }
        }
    }

    /**
     * Calls an API, sending a seed, and getting back an ArrayBuffer reprsenting that image
     * This function directly saves the image data and ArrayBuffer to state
     * @param {string} seedArr - string version of a 1xSEED_LENGTH array of floats between -1,1  
     * @param {Float[]} labelArr - data version of a 1000 length array of floats between 0,1
     */
    getGenImage(seedArr, labelArr) {

        let labels = `[[${labelArr.toString()}]]`;

        const apiURL = 'https://methack-api.azure-api.net/biggan/labels?subscription-key=43d3f563ea224c4c990e437ada74fae8';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed',seedArr);
        data.append('labels', labels);
        Http.responseType = "arraybuffer";
        Http.open("POST", apiURL);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try{
                    let imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response)));
                    this.setState({genImg: imgData, genArr: Http.response});

                } catch (e) {
                    console.log('malformed request:'+Http.responseText);
                }
            }
        }
    }

    getData() {
        let data =
            [{
                type: 'scatter',
                mode: 'markers+text',
                text: [
                    '(0) [0.2, 0.8]', '(1) [0.4, 0.4]', '(2) [0.8, 0.6]', '(3) [1.1, 0.8]', '(4) [0.6, 1.0]'
                ],
                x: [
                    0.2, 0.4, 0.8, 1.1, 0.6
                ],
                y: [
                    0.8, 0.4, 0.6, 0.8, 1.0
                ],

                marker: {
                    size: 7,
                    color: [
                        '#bebada', '#fdb462', '#fb8072', '#d9d9d9', '#fdc412'
                    ],
                    line: {
                        width: 1
                    }
                },
                name: 'Canadian cities',
                textposition: [
                    'top right', 'top left', 'top center', 'bottom right', 'bottom left'
                ],
            }];
        return data;
    }

    getLayout() {

        let mouseX = this.state.mouseCoords[0];
        let mouseY = this.state.mouseCoords[1];
        let neighCoords = this.state.neighborCoords;

        let lines = Object.keys(this.state.neighborCoords).map(index => (
            {
                type: 'line',
                x0: mouseX,
                y0: mouseY,
                x1: neighCoords[index][0],
                y1: neighCoords[index][1],
                line: {
                    color:'rgb(55, 128, 191)',
                    width:3
                }
            }
        ))

        let layout = {
            margin: { 'l': 0, 'r': 0, 't': 0, 'b': 0 },
            xaxis: { range: [0.1, 1.3] },
            yaxis: { range: [0.1, 1.3] },
            shapes : lines,
            hovermode: 'closest',
            images: this.getImages(),
            autosize: true,
        };
        return layout
    }

    render() {
        const COMPLETE_NUMBER_IMAGES_TO_LOAD = 9;
        if (this.state.imgObjectsExplore.length !== COMPLETE_NUMBER_IMAGES_TO_LOAD) {
            return <div > </div>;
        }
        return (
            <div >
                <Box
                    align= 'center'
                    style= {{ marginTop: '25px' }}
                >
                    <GenArt image={this.state.genImg} data={this.state.genArr} />
                </Box>

                <Box
                    id="plotlyBox"
                    style={{ padding: '2px', marginTop: '25px', width: "80%", height: "100%", justifySelf: "center" }}
                    // border={{ color: "black", size: "4px" }}
                    round="small"
                    onMouseDown={(e) => this.onMouseClick(e)}
                    onMouseMove={(e) => this.onMouseHover(e)}
                >

                    <Plot 
                        data={this.getData()}
                        layout={this.getLayout()}
                        onHover={(figure) => this.handleHover(figure)}
                        style={{ width: "100%", height: "100%" }}
                        useResizeHandler={true}
                        config={{ displayModebar: false }}
                    />
                </Box>
            </div>
        );          
    }

    componentDidMount() {
        this.state.data = this.getData();

        //Parse the art ID's from the url into an int[]
        let url = this.props.match.params.id.toString();
        url = decodeURIComponent(url);
        let selectedArt = url.split('&')[0].slice(4);
        let artArr = url.split('&')[1].slice(4);        
        artArr = JSON.parse(artArr);

        //Get the images for the art IDs
        this.objIDsToImages(artArr);

        //Generate the first generated image
        this.firstTimeGenImage(selectedArt);
    }

    /* 
     * Handles when a custom coordinate in the graph has been selected. 
     */
    onMouseClick(e) {

        let latentLabel = this.coordsToLatentLabel(e.pageX, e.pageY);

        //latent is in format '[[fl,fl,fl,...#140]]
        //labels is in format [fl, fl, fl, ...#1000]
        this.getGenImage(latentLabel.latents, latentLabel.labels);
    }

    onMouseHover(e) {

        this.setCoords(e.pageX, e.pageY);
    }

    /**
     * Given cursor coordinates, returns the latens and labels of the corresponding generated image
     * @param {int} xCoord - the x coord of the cursor, from an event
     * @param {int} yCoord - the y coord of the cursor, from an event
     * @returns {latents, labels} - the latents and labels based on the coordinates
     */
    coordsToLatentLabel(xCoord, yCoord) {
        //get plotly coordinates
        let relCoords = this.convertToRelativeCoords(xCoord, yCoord);
        let plotlyCoords = this.convertToPlotlyData(relCoords[0], relCoords[1]);
        //find nearest neighbors on graph
        let closestNeighbors = this.getNearestNeighbors(plotlyCoords, 3);
        let latentAndLabel = this.generateInterpSeed(closestNeighbors);

        let latent = `[[${latentAndLabel.latent}]]`
        let label = latentAndLabel.label

        return {latents: latent, labels: label}
    }

    /**
     * Give cursor coordinates, stores the cursor coordinates and the nearest neighbor coordinates to state
     * @param {int} xCoord - the x coord of the cursor, from an event
     * @param {int} yCoord - the y coord of the cursor, from an event
     */
    setCoords(xCoord, yCoord) {
                //Get plotly coordinates
                let relCoords = this.convertToRelativeCoords(xCoord, yCoord);
                let plotlyCoords = this.convertToPlotlyData(relCoords[0], relCoords[1]);
        
                //find nearest enighbors on graph
                let closestNeighbors = this.getNearestNeighbors(plotlyCoords, 3);
                let neighborIDs = Object.keys(closestNeighbors);
        
                let neighCoords= {}
                
                //Populate neighCoords
                for(let i = 0; i< neighborIDs.length; i++){
                    let id = neighborIDs[i];
                    let index = closestNeighbors[id].index;
                    let xCoord = this.state.data[0].x[index];
                    let yCoord = this.state.data[0].y[index];
                    neighCoords[i] = [xCoord, yCoord];
                }
        
                this.setState({
                    mouseCoords: plotlyCoords,
                    neighborCoords: neighCoords
                })
    }

    /**
     * Given an object of neighbors and their index and distance, returns a label and latent representing a generated image
     * @param {ID: index, distance} neighbors - Int[] is array of obj ids, ?Float?[] are the distances to those,
     * of the closest neighbors to a click, where the number of neighbors taken  were decided earlier in the stack
     * @returns {label, latent} - the generated label and latent based on the neighbors
     */
    generateInterpSeed(neighbors) {
        const neighborIDs = Object.keys(neighbors);
        const numNeigh = neighborIDs.length;
        let sumDist = 0
        for (let i = 0; i < numNeigh; i++){
            sumDist = sumDist + neighbors[neighborIDs[i]].distance;
        }

        let totalLatent = Array.apply(null, Array(140)).map(Number.prototype.valueOf,0);
        let totalLabel = Array.apply(null, Array(1000)).map(Number.prototype.valueOf,0);;
        for (let i = 0; i < numNeigh; i++){
            let ratio = neighbors[neighborIDs[i]].distance/sumDist;
            let scaledLatent = this.scalarMultiplyVector(this.state.images[neighborIDs[i]].latents, ratio);
            let scaledLabel = this.scalarMultiplyVector(this.state.images[neighborIDs[i]].labels, ratio);
            totalLatent = this.addVector(totalLatent, scaledLatent);
            totalLabel = this.addVector(totalLabel, scaledLabel);
        }

        return {latent: totalLatent, label: totalLabel};
    }

    /**
     * adds two vectors of the same length together!
     * @param {Float[]} v1 - vector 1
     * @param {Float[]} v2 - vector 2
     */
    addVector(v1, v2){

        let sumVec = [];
        for (let i= 0; i< v1.length; i++){
            sumVec.push(v1[i]+v2[i])
        }

        return sumVec;
    }

    /**
     * Multiplies a vector by a scalar
     * @param {Float[]} vec 
     * @param {Float} scalar 
     */
    scalarMultiplyVector(vec, scalar){
        let newVec = [];
        for (let i= 0; i< vec.length; i++){
            newVec.push(vec[i]*scalar)
        }
        return newVec;
    }

    /**
     * gets the relevant data of the [numNeighbors] nearest neighboors of mouse click position
     * 
     * @param {any} plotlyCoords - [x, y] coordinates of mouse click position in plotly space
     * @param {int} numNeighbors - the number of neighbors to consider for new gen seed
     * @returns {JSON object} - {id1: {'index': INDEX1, 'distance': DISTANCE1}, id2: {...}, ...}
     */
    getNearestNeighbors(plotlyCoords, numNeighbors) {
        let objectIds = Object.keys(this.state.images);
        let response = {};
        Array.min = function (array) {
            return Math.min.apply(Math, array);
        };
        let xCoordsPlotly = this.state.data[0].x;
        let yCoordsPlotly = this.state.data[0].y;
        let distances = xCoordsPlotly.map((x, i) => {
            return this.calculateDistance([x, yCoordsPlotly[i]], plotlyCoords);
        });
        let distancesUpdated = distances.slice(0);
        
        for (let i = 0; i < numNeighbors; i++) {
            let newNeighbor = { index: 0, distance: 0 };
            //find the index of the smallest value in distancesUpdated
            let minVal = Array.min(distancesUpdated);
            //use the index of unchanged distances list
            let indexClosest = distances.indexOf(minVal);
            newNeighbor.index = indexClosest;
            newNeighbor.distance = minVal;
            response[objectIds[indexClosest]] = newNeighbor;
            //remove the smallest distance we just found
            distancesUpdated.splice(distancesUpdated.indexOf(minVal), 1);
        }

        return response;
    }

    calculateDistance(coord1, coord2) {
        var a = coord1[0] - coord2[0];
        var b = coord1[1] - coord2[1];
        return Math.sqrt(a * a + b * b);
    }

    /* 
     * Takes in the pixel values of the div, and returns the coordinate
     * values in the plotly coordinate space
     */
    convertToRelativeCoords(x, y) {
        let relX = x - document.getElementById('plotlyBox').offsetLeft;
        let relY = y - document.getElementById('plotlyBox').offsetTop;
        let width = document.getElementById('plotlyBox').clientWidth + 8;
        let height = document.getElementById('plotlyBox').clientHeight + 8;

        relX = relX / width;
        relY = relY / height;
        return [relX, relY];
    }

     /* 
     * Converts our normalized (0->1) coords to a plotly data point coord
     */
    convertToPlotlyData(x, y) {
        const maxY = 1.3;
        const maxX = 1.3;
        const minY = 0.1;
        const minX = 0.1;

        let plotlyX = x * (maxX - minX) + minX;
        let plotlyY = (1.0 - y) * (maxY - minY) + minY;// + 0.011;
        return [plotlyX, plotlyY];
    }

    /**
     * sets state.imgObjectsExplore to contain a json object for each ID provided. object format: {img, id, key}
     * @param {Int[]} objIDs - an array of art IDs
     */
    objIDsToImages(objIDs) {

        const baseURL = 'https://deepartstorage.blob.core.windows.net/public/thumbnails3/';

        let apiURLs = objIDs.map(ID => (
            {
                url: baseURL + ID.toString(),
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
                        console.log('malformed request:' + Http.response.toString());
                    }
                }
            }
        }
    }

    /**
     * Sets up component state the first time for the selected image represented by id
     * @param {int} id - object ID of the initial piece of art to generate an image for
     */
    firstTimeGenImage(id) {

        const baseMetUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        let metApiUrl = baseMetUrl + id;

        const Http = new XMLHttpRequest();
        Http.open("GET", metApiUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({
                        imgData: response.primaryImage,
                        apiData: response
                    })

                    const imageToSeedUrl = "https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
                    const fileName = response.objectID.toString() + ".json";
                    const Http2 = new XMLHttpRequest();
                    Http2.open("GET", imageToSeedUrl + fileName);
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
     * Converts a 2D array string into a 1D array of floats
     * @param {string} arrayString - string version of a 1x? array of floats
     * @returns {Float[]} - The 1D float array from arrayString
     */
    twoDArrayStringToOneDArray(arrayString) {
        let numbers = arrayString.substring(2, arrayString.length - 2); //cut off the "[[]]"
        let arrayNum = numbers.split(',').map(function (item) {
            return parseFloat(item);
        });
        return (arrayNum);
    }

    /**
     * Calls an API, sending a seed, and getting back an ArrayBuffer reprsenting that image
     * This function directly saves the ArrayBuffer to state
     * @param {string} seedArr - string version of a 1xSEED_LENGTH array of floats between -1,1  
     */
    getGenImage(seedArr, labelArr) {
        let labels = labelArr.toString();
        labels = `[[${labels}]]`;

        const apiURL = 'https://methack-api.azure-api.net/biggan/labels?subscription-key=43d3f563ea224c4c990e437ada74fae8';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed', seedArr);
        data.append('labels', labels);

        Http.responseType = "arraybuffer";
        Http.open("POST", apiURL);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    let imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response)));
                    this.setState({ genImg: imgData, genArr: Http.response });

                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    /* 
     * When an art piece is hovered over, the information should be displayed:
     * title, creator, date, etc (show link to explore similar?)
     */
    handleHover(eventData) {
        //console.log("HOVER DETECTED!");
        //console.log(eventData);
    }
}