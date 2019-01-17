import React, { Component } from 'react';
import PaletteBox from './PaletteBox.jsx';

import { Box, Grid, Image} from 'grommet';
import testData from './testData.js';

/**
 * The Palette used to explore the images
 * 'addSeed' prop: callback to add an image to the current seed
 * 'subSeed' prop: callback to subtract an image from the current seed
 */
export default class ExplorePalette extends Component {
    constructor(props){
        super(props);
    };

    render(){
        return(
            <Grid
                columns={["small", "small","small"]}
                rows={"meduim"}
                gap="medium"
                margin="40px"
            >
                {this.props.images.map(tile => (
                    <PaletteBox key={tile.key} img={tile.img} addSeed={this.props.addSeed} subSeed={this.props.subSeed}/>
                ))}
            </Grid>
        );
    }
}