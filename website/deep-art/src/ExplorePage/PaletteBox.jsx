import React, { Component } from 'react';
import { Box, Image} from 'grommet';

import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';

/**
 * One box in the palette
 * 'addSeed' prop: callback to add an image to the current seed
 * 'subSeed' prop: callback to subtract an image from the current seed
 */
export default class PaletteBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            imgSeed: [],
        }

        this.addClick = this.addClick.bind(this);
        this.subClick = this.subClick.bind(this);
    };

    componentDidMount(){
        this.makeRandomSeed();
    }

    /**
     * Makes a random 1x512 array of floats in the range -1,1
     * Directly modifies state and saves it into imgSeed
     */
    makeRandomSeed(){
        let seed = [];
        for (let i = 0; i<512; i++){
            let seedNum = (2.0 * Math.random()) - 1.0;
            seed.push(seedNum);
        }
        this.setState({
            imgSeed: seed
        });
    }

    /**
     * Callback given to AddButton to connect to props.addSeed
     */
    addClick(){
        this.props.addSeed(this.state.imgSeed);
    }

    /**
     * Callback given to RemoveButton to connect to props.subSeed
     */
    subClick(){
        this.props.subSeed(this.state.imgSeed);
    }

    render(){
        return(
            <Box border=
                {{ color: "black", size: "3px" }}
                round="small"
                height="small"
                width="small"
            >
                <Image
                    src={this.props.img}
                    fit="cover"
                    style={{ zIndex: "-1"}}
                />
                <Box
                    fill="horizontal"
                    direction="row"
                    alignSelf = "center"
                    margin="xsmall"
                    style={{"justifyContent": "space-around"}}
                >
                    <RemoveButton subClick={this.subClick}/>
                    <AddButton addClick={this.addClick}/>
                </Box>
            </Box>   
        );
    }
}