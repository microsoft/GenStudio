import React, { Component } from 'react';
import GenArt from './GenArt.jsx';
import { Box, Grid, Text } from 'grommet';
import setupPlotly from './map.js';

/**
 * A map explore page to explore the latent space of BigGAN
 */
export default class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state ={
            cursorPoint: null
        };
    }

    componentDidMount() {
        //Decode the url data
        let url = this.props.match.params.id.toString();
        url = decodeURIComponent(url);
        let selectedArt = url.split('&')[0].slice(4);
        let artArr = url.split('&')[1].slice(4);
        artArr = JSON.parse(artArr);

        //Setup the Plotly graph
        setupPlotly(this, artArr, selectedArt);
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
                            Explore the mind of a Generative Adversarial Network that has been trained to create artworks from the Met's collection!
                        </Text>
                        <Text style={{fontWeight:"550"}}>
                            Click or drag the cursor to generate art. Click "Explore Similiar" to find your object's closest matches in the MET.
                        </Text>
                        

                    </Box>
                </Box>

                <Box gridArea='image' direction='column' align="center" style={{justifyItems: "center"}}>
                        <GenArt message={this.state.message} image={this.state.genImg} data={this.state.genArr} />
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


