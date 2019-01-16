import React, { Component } from 'react';
import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';
import PaletteBox from './PaletteBox.jsx';

import { Box, Grid, Image} from 'grommet';
import testData from './testData.js';

export default class ExplorePalette extends Component {
    condtructor(props){

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