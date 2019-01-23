import React, { Component } from 'react';
import { Box, Button, Image, Text} from 'grommet';

/**
 * One box in the Result Grid
 * 'data' prop: json object from azure search index {@search.score, ObjectID, Department, Title, Culture, Medium, Classification, LinkResource, PrimaryImageUrl, Neighbors}
 */
export default class PaletteBox extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    };

    render(){
        let text = `${this.props.data.Title}`
        return(
            <Box border=
                {{ color: "black", size: "4px" }}
                round="small"
                height="medium"
                width="medium"
            >
                <Button href={this.props.data.LinkResource} style={{height: '70%'}}>
                    <Box height="100%" width="100%">
                        <Image
                                    src={this.props.data.PrimaryImageUrl}
                                    fit="cover"
                                    style={{ height: '100%', zIndex: "-1"}}
                        />
                    </Box>
                </Button>


                <Box
                    fill="horizontal"
                    direction="row"
                    alignSelf = "center"
                    margin="xsmall"
                    style={{"justifyContent": "space-around", minHeight:"fit-content", flex:2}}
                >
                <Text>{text}</Text>
                </Box>
            </Box>   
        );
    }
}