import React, { Component } from 'react';
import styled from "styled-components";

import AddButton from './AddButton.jsx';
import RemoveButton from './RemoveButton.jsx';

import { Box, Button, Grid, Text, Image} from 'grommet';

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';

// import Card from 'react-bootstrap/lib/Card';
// import CardDeck from 'react-bootstrap/lib/CardDeck';
//import CardGroup from 'react-bootsrap/lib/CardGroup';
//import CardColumns from 'react-bootsrap/lib/CardColumns';
// import Button from 'react-bootstrap/lib/Button';

// import { Card, Button, CardImg, CardTitle, CardText, CardColumns,
//     CardSubtitle, CardBody } from 'reactstrap';

import testData from './testData.js';


const GridDiv = styled.div`
    width: 40vw;
    margin: 5vw;
    `

const ButtonDiv = styled.div`
    display: flex;
    flex flow: row wrap;
    justify-content: space-between;
    `

export default class ExplorePalette extends Component {
    condtructor(props){

    };

    render(){
        return(
            // <GridDiv>
            //     <GridList cellHeight={'auto'} cols={3} spacing={20}>
            //         {testData.map(tile => (
            //             <GridListTile key={tile.img} cols={tile.cols || 1}>
            //                 <Card>
            //                     <CardMedia
            //                         image={tile.img}
            //                         title={tile.title}
            //                         style={{minWidth: '100%', width: "30vw", paddingTop: '100%'}}
            //                     />
            //                     <CardContent>
            //                         <ButtonDiv>
            //                             <RemoveButton/>
            //                             <AddButton/>
            //                         </ButtonDiv>
            //                     </CardContent>
            //                 </Card>
            //             </GridListTile>
            //         ))}
            //     </GridList>
            // </GridDiv>
            <Grid
                columns={["medium","medium","medium"]}
                rows={"medium"}
                gap="small"
            >
                {testData.map(tile => (
                    <Box>
                        <Box>
                            <Image src={tile.img} fit="cover" />
                        </Box>
                        <Box>
                            <RemoveButton/>
                            <AddButton/>
                        </Box>
                    </Box>
                ))}
            </Grid>
        );
    }
}