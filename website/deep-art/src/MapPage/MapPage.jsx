import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import GenArt from './GenArt.jsx';
import { Box, Grid, Text } from 'grommet';
import Softmax from 'softmax-fn';
import setupPlotly from './map.js';

export default class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state ={
            cursorPoint: null
        };
    }

    componentDidMount() {
        let firstID = 201671;
        let objIDs = [22270, 22408, 22848, 23143, 35652, 201671, 202194];
        setupPlotly(this, objIDs, firstID);
    }

    render() {
        return (
            <Grid
                fill="horizontal"
                areas={[
                    { name: 'text', start: [0, 0], end: [1,0] },
                    { name: 'image', start: [0, 1], end: [0, 1] },
                    { name: 'map', start: [1, 1], end: [1, 1] },  
                ]}
                columns={['medium','flex']}
                rows={["xsmall","45rem"]}
                gap='small'
                style={{paddingLeft: "3rem", paddingRight: "3rem"}}
            >

                <Box fill gridArea='text'>
                    <Box fill style={{flexFlow: "column", alignSelf:"start", justifyContent:"space-around"}}>
                        <Text style={{fontWeight:"550"}}>
                            Explore the map to discover new objects in the space between existing Met artworks.
                        </Text>
                        
                        <Text>
                            A trained GAN (Generative Adversarial Network) contains a model of a shared feature space underlying a collection of images. Based on given artworks from the Met collection, the GAN generates new objects that could have been made, but maybe never were.
                        </Text>
                    </Box>
                </Box>

                <Box gridArea='image' direction='column' align="center" style={{justifyItems: "center"}}>
                        <GenArt point={this.state.cursorPoint} image={this.state.genImg} data={this.state.genArr} />
                </Box>

                <Box gridArea='map' background="accent-3"
                    id="plotlyBox"
                    style={{ padding: '2px', width: "100%", justifySelf: "center", justifyItems: "center" }}
                    round="small"
                >
                    <div id="myPlot" className="plot"></div>
                </Box>
            </Grid>
        );          
    }

   
}


