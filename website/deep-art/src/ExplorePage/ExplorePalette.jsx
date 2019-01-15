import React, { Component } from 'react';
import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';
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
                {testData.map(tile => (
                    <Box border=
                        {{ color: "black", size: "3px" }}
                        round="small"
                        height="small"
                        width="small"
                    >
                        <Image
                            src={tile.img}
                            fit="cover"
                            style={{ zIndex: "-1"}}
                        />
                        <Box
                            fill="horizontal"
                            direction="row"
                            alignSelf = "center"
                            margin="xsmall"
                            style={{"justify-content": "space-around"}}
                        >
                            <RemoveButton/>
                            <AddButton/>
                        </Box>
                    </Box>
                ))}
            </Grid>
        );
    }
}