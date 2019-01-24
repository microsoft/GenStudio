import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import GenArt from './GenArt.jsx';
import { Box} from 'grommet';

export default class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], layout: {}, frames: [], config: {} };
    }

    getImages() {
        let thumbnailRoot = "https://deepartstorage.blob.core.windows.net/public/thumbnails2/";
        let paintingIds = [1002, 10024, 10025, 10026, 10028];
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
        console.log(images);
        return images;
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
        let layout = {
            margin: { 'l': 0, 'r': 0, 't': 0, 'b': 0 },
            xaxis: { range: [0.1, 1.3] },
            yaxis: { range: [0.1, 1.3] },
            hovermode: 'closest',
            images: this.getImages(),
            autosize: true,
        };
        return layout
    }

    render() {
        return (
            <div >
                <Box
                    align= 'center'
                    style= {{ marginTop: '25px' }}
                >
                    <GenArt image={"https://static.seattletimes.com/wp-content/uploads/2018/10/90a2c67c-ba17-11e8-b2d9-c270ab1caed2-1020x776.jpg"} />
                </Box>

                <Box
                    id="plotlyBox"
                    align='center'
                    style={{ padding: '2px', marginTop: '25px', width: "100%", height: "100%" }}
                    border={{ color: "black", size: "4px" }}
                    round="small"
                    onMouseDown={(e) => this.onMouseClick(e)}
                    onMouseMove={(e) => this.onMouseHover(e)}
                >

                    <Plot 
                        data={this.getData()}
                        layout={this.getLayout()}
                        onHover={(figure) => this.handleHover(figure)}
                        onInitialized={this.initializeData()}
                        style={{ width: "100%", height: "100%" }}
                        useResizeHandler={true}
                        config={{ displayModebar: false }}
                    />
                </Box>
            </div>
        );          
    }


    initializeData() {
        this.state.data = this.getData();
    }

    /* 
     * Handles when a custom coordinate in the graph has been selected. 
     */
    onMouseClick(e) {
        //get plotly coordinates
        let relCoords = this.convertToRelativeCoords(e.pageX, e.pageY);
        let plotlyCoords = this.convertToPlotlyData(relCoords[0], relCoords[1]);
        //find nearest neighbors on graph
        let closestNeighbors = this.getNearestNeighbors(plotlyCoords, 2);
        let interpSeed = this.generateInterpSeed(closestNeighbors);

    }

    getInterpSeed(neighbors, numNeighbors) {
        //getSeed for the closest MET images (2 or 3 (rn 2))
        let seed1 = [512];
        let seed2 = [512];

        //find new seed
        if (numNeighbors === 2) {
            let distance1 = neighbors[1][0];
            let distance2 = neighbors[1][1];
            let ratio1 = distance1 / (distance1 + distance2);
            let ratio2 = 1.0 - ratio1;
            return seed1 * ratio1 + seed2 * ratio2;
        }

    }

    getNearestNeighbors(plotlyCoords, numClosest) {
        let xCoordsPlotly = this.state.data[0].x;
        let yCoordsPlotly = this.state.data[0].y;
        let distances = xCoordsPlotly.map((x, i) => {
            return this.calculateDistance([x, yCoordsPlotly[i]], plotlyCoords);
        });

        Array.min = function (array) {
            return Math.min.apply(Math, array);
        };
        let closestDistances = [0,0];
        let minVal = Array.min(distances);
        closestDistances[0] = minVal;
        let indexClosest1 = distances.indexOf(minVal);
        distances.splice(indexClosest1, 1);
        minVal = Array.min(distances);
        closestDistances[1] = minVal;
        let indexClosest2 = distances.indexOf(minVal);
        if (indexClosest1 <= indexClosest2) {
            indexClosest2 = indexClosest2 + 1;
        }
        let indices = [indexClosest1, indexClosest2];
        return [indices, closestDistances];
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

    /* 
     * When an art piece is hovered over, the information should be displayed:
     * title, creator, date, etc (show link to explore similar?)
     */
    handleHover(eventData) {
        //console.log("HOVER DETECTED!");
        //console.log(eventData);
    }

    onMouseHover(eventData) {
        //let relCoords = this.convertToRelativeCoords(eventData.pageX, eventData.pageY);
        //console.log("relative coords: " + relCoords);
        //let plotlyCoords = this.convertToPlotlyData(relCoords[0], relCoords[1]);
        //console.log("plotly coords: " + plotlyCoords);

    }
}