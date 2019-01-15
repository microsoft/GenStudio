import React, { Component } from 'react';
import { Box, Image} from 'grommet';

import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';

export default class PaletteBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            imgSeed: 0,
        }

        this.addClick = this.addClick.bind(this);
        this.subClick = this.subClick.bind(this);
    };

    componentDidMount(){
        this.makeRandomSeed();
    }

    makeRandomSeed(){
        let seed = [];
        for (let i = 0; i<512; i++){
            let seedNum = Math.floor(1000* Math.random());
            seed.push(seedNum);
        }
        this.setState({
            imgSeed: seed
        });
    }

    addClick(){
        //console.log("Add Click");
        this.props.addSeed(this.state.imgSeed);
    }

    subClick(){
        //console.log("Sub Click");
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