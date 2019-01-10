import React, { Component } from 'react';
import { Box, Image, Grid} from 'grommet';
import styled from "styled-components";

const GridWrapper = styled(Box)`
    flex-grow: 1;
    direction: row;
    align-items: center;
    padding-top: 2rem;      
`

export default class ResultArt extends Component {
    constructor(props){
        super(props);
    };



    render(){

        return(
            <GridWrapper>
                <Grid
                    columns={["small", "small","small"]}
                    rows={"meduim"}
                    gap="medium"
                    margin="40px"
                >
                    {this.props.images.map(image => (
                        <Box border=
                            {{ color: "black", size: "3px" }}
                            round="small"
                            height="small"
                            width="small"
                            key={image}
                        >
                            <Image
                                src={image}
                                fit="cover"
                                style={{ zIndex: "-1"}}
                            />
                        </Box>
                    ))}
                </Grid>
            </GridWrapper>    
        );
    }
}