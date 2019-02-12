import React, { Component } from 'react';
// import { Box, Button, Image, Text} from 'grommet';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LazyLoad from 'react-lazyload';

/**
 * One box in the Result Grid
 * 'data' prop: json object from azure search index {@search.score, ObjectID, Department, Title, Culture, Medium, Classification, LinkResource, PrimaryImageUrl, Neighbors}
 */
export default class ResultBox extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    };

    //Material UI version
    render(){
        let media = (this.props.data.PrimaryImageURL === undefined || this.props.data.PrimaryImageURL === null) ? 
            <LazyLoad throttle={200} height={500}>
                <CardMedia 
                component="img"
                src={this.props.data.PrimaryImageUrl}
                style={{
                    alignSelf:"center", 
                    alignItems:"ceneter", 
                    maxWidth:"500px", width:"fit-content", maxHeight: "500px", objectFit:'contain'}}
                />
            </LazyLoad>
        :
        <CircularProgress style={{color: "#6A6A6A"}} />;
        
        return(
            <Card raised={false} elevation={0} style={{ background: "#FFFFFF", display: "flex", flexFlow:"column wrap", height:"fit-content", alignItems:"center",}}>
                <CardActionArea href={this.props.data.LinkResource} target="_blank" style={{display: "flex", justifyItems:"start"}}>
                    {/* <CardMedia 
                        component="img"
                        src={this.props.data.PrimaryImageUrl}
                        style={{
                            alignSelf:"center", 
                            alignItems:"ceneter", 
                            maxWidth:"500px", width:"fit-content", maxHeight: "500px", objectFit:'contain'}}
                    /> */}
                    {media}
                </CardActionArea>
                <CardContent style={{flexFlow: "column wrap", alignSelf:"start"}}>
                    <Typography component="p" style={{fontWeight: "600", fontSize: "18px"}}>
                        {this.props.data.Title}
                    </Typography>

                    <Typography component="p">
                        {this.props.data.Department}
                    </Typography>

                </CardContent>
                
            </Card>
        )
    }


    // Grommet Version
    // render(){
    //     let text = `${this.props.data.Title}`
    //     return(
    //         <Box border=
    //             {{ color: "black", size: "4px" }}
    //             round="small"
    //             height="medium"
    //             width="medium"
    //         >
    //             <Button href={this.props.data.LinkResource} style={{height: '70%'}}>
    //                 <Box height="100%" width="100%">
    //                     <Image
    //                                 src={this.props.data.PrimaryImageUrl}
    //                                 fit="cover"
    //                                 style={{ height: '100%', zIndex: "-1"}}
    //                     />
    //                 </Box>
    //             </Button>
    //             <Box
    //                 fill="horizontal"
    //                 direction="row"
    //                 alignSelf = "center"
    //                 margin="xsmall"
    //                 style={{"justifyContent": "space-around", minHeight:"fit-content", flex:2}}
    //             >
    //             <Text>{text}</Text>
    //             </Box>
    //         </Box>   
    //     );
    // }
}