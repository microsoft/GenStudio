import React, { Component } from 'react';
import { Box, Image, Stack} from 'grommet';

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
            imgLabels: [],
        }

        this.addClick = this.addClick.bind(this);
        this.subClick = this.subClick.bind(this);
    };

    componentDidMount(){
        //this.makeRandomSeed();
        this.getSeed();
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

    getSeed(){
        const imageToSeedUrl="https://deepartstorage.blob.core.windows.net/public/inverted/biggan1/seeds/";
        const fileName = this.props.id.toString()+".json";
        const Http = new XMLHttpRequest();
        Http.open("GET", imageToSeedUrl+fileName);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({
                        imgSeed: response.latents,
                        imgLabels: response.labels
                    });


                } catch {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    /**
     * Callback given to AddButton to connect to props.addSeed
     */
    addClick(){
        this.props.addSeed(this.state.imgSeed, this.state.imgLabels);
    }

    /**
     * Callback given to RemoveButton to connect to props.subSeed
     */
    subClick(){
        this.props.subSeed(this.state.imgSeed, this.state.imgLabels);
    }

    render(){
        return(
            <Box 
            //border=
            //    {{ color: "black", size: "4px" }}
                round="small"
                height="small"
                width="small"
            >
            <Stack anchor="bottom" fill>
                <Box>
                    <Image
                        src={"data:image/jpeg;base64,"+this.props.img}
                        fit="cover"
                        style={{ height: '100%', zIndex: "-1"}}
                    />
                </Box>

                <Box
                    fill="horizontal"
                    direction="row"
                    alignSelf = "center"
                    margin="xsmall"
                    style={{"justifyContent": "space-around"}}
                    //height="30%"
                    width="small"
                >
                    <RemoveButton subClick={this.subClick}/>
                    <Box width="50px"/>
                    <AddButton addClick={this.addClick}/>
                </Box>
            </Stack>

            </Box>   
        );
    }
}