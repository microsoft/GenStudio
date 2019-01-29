import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import GenArt from './GenArt.jsx';
import { Box } from 'grommet';
import Softmax from 'softmax-fn';
import setupPlotly from './map.js';

export default class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        //this.generateInterpSeed = this.generateInterpSeed.bind(this);
        //this.setCoords = this.setCoords.bind(this);
        //this.coordsToLatentLabel = this.coordsToLatentLabel.bind(this);
    }

    componentDidMount() {
        setupPlotly(this);
    }

    render() {
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
                >
                    <div id="myPlot" className="plot"></div>
                </Box>
            </div>
        );          
    }

   
}


