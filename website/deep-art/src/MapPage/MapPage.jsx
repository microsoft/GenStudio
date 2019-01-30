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
        let url = this.props.match.params.id.toString();
        url = decodeURIComponent(url);
        let selectedArt = url.split('&')[0].slice(4);
        let artArr = url.split('&')[1].slice(4);
        artArr = JSON.parse(artArr);
        setupPlotly(this, artArr, selectedArt);
    }

    render() {
        return (
            <Grid
                fill="horizontal"
                areas={[
                    { name: 'text', start: [0, 0], end: [0, 1] },
                    { name: 'image', start: [0, 1], end: [0, 1] },
                    { name: 'map', start: [1, 1], end: [1, 1] },  
                ]}
                columns={['medium','flex']}
                rows={["xsmall","45rem"]}
                gap='small'
                style={{paddingLeft: "3rem", paddingRight: "3rem"}}
            >

            <Box gridArea='text' style={{justifyItems: "center"}}>
                <Text>
                    Oranges are just sunburnt lemons
                </Text>
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


