import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import GenArt from './GenArt.jsx';
import { Box, Button, Grommet, Select, Text, TextInput} from 'grommet';

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
                    'Montreal', 'Toronto', 'Vancouver', 'Calgary', 'Woodside'
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
            margin: { 'l': 0, 'r': 0, 't': 50, 'b': 0 },
            xaxis: { range: [0.1, 1.3] },
            yaxis: { range: [0.0, 1.3] },
            hovermode: 'closest',
            title: 'Explore Imaginary Met Art',
            images: this.getImages(),
            autosize:true

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
                    align='center'
                    style={{ padding: '2px', marginTop: '25px', width: "100%", height: "100%" }}
                    border={{ color: "black", size: "4px"}}
                    round="small"
                    onMouseDown={(e) => this.onMouseClick(e)}
                >

                        <Plot 
                            id = "plot"
                            data={this.getData()}
                            layout={this.getLayout()}
                            onClick={(figure) => console.log("test1")}
                            onHover={(figure) => this.handleHover(figure)}
                            onInitialized={(figure) => console.log("test3")}
                            style={{ width: "100%", height: "100%"}}
                            useResizeHandler={true}
                        />
                </Box>
            </div>
        );          
    }

    onMouseClick(e) {
        console.log(e.clientX + "," + e.clientY);
        console.log(e);
    }

    handleClick(eventData) {
        console.log("here!");
        console.log("eventData: " + eventData);
    }

    handleHover(eventData) {
        console.log("HOVER DETECTED!");
        console.log(eventData);
    }
}