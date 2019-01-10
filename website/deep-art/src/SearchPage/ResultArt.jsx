import React, { Component } from 'react';
import { Box, Button, Image, Grid} from 'grommet';
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
                        <Button fill={false} href={"/explore/"+image.id.toString()}>
                        <Box border=
                            {{ color: "black", size: "3px" }}
                            round="small"
                            height="small"
                            width="small"
                            key={image.id}
                        >
                            
                                <Image
                                    src={image.img}
                                    fit="cover"
                                    style={{ zIndex: "-1"}}
                                />
                            
                        </Box>
                        </Button>
                    ))}
                </Grid>
            </GridWrapper>    
        );
    }
}