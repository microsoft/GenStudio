import React, { Component } from 'react';
import { Box, Grid, Text} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import ImageGraph from './ImageGraph.jsx';

export default class GraphPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: "",
            tags: ["a","b","c"],
            tagData: {"a": false, "b": false, "c": false},
            nodes: [],
            edges: [],
        };
        this.getChange = this.getChange.bind(this);
        this.getTagChange = this.getTagChange.bind(this);
    };

    getChange(newSearchValue){
        this.setState({searchValue: newSearchValue});
    }

    getTagChange(label, value){
        this.setState((oldState) => {
            return oldState.tagData[label] = value;
        });
    }

    componentDidMount() {
        const azureSearchApiUrl = 'https://metartworksindex.search.windows.net/indexes/met-items/docs?api-version=2017-11-11&search=';
        const searchQuery = 'puppy';
        const Http = new XMLHttpRequest();
        Http.open("GET", azureSearchApiUrl + searchQuery);
        Http.setRequestHeader('api-key', '11A584ECD13C39D335F57939D502673D');
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({nodes: [{id: 1, label: response.value[0].Title, shape: 'image', image: response.value[0].PrimaryImageUrl}]});
                    
                    for (let i = 0; i < Math.min(5, response.value[0].Neighbors.length); i++) {
                        const HttpNeighbor = new XMLHttpRequest();
                        HttpNeighbor.open("GET", azureSearchApiUrl + response.value[0].Neighbors[i]);
                        HttpNeighbor.setRequestHeader('api-key', '11A584ECD13C39D335F57939D502673D');
                        HttpNeighbor.send();
                        HttpNeighbor.onreadystatechange = (e) => {
                            if (HttpNeighbor.readyState === 4) {
                                try {
                                    console.log(this.state.nodes);
                                    let neighborResponse = JSON.parse(HttpNeighbor.responseText);
                                    // console.log(i + 2);

                                    let oldNodesCopy = this.state.nodes.slice();
                                    // console.log(oldNodesCopy);

                                    oldNodesCopy.push({id: i + 2, label: neighborResponse.value[0].Title, shape: 'image', image: neighborResponse.value[0].PrimaryImageUrl});
                                    // console.log(oldNodesCopy);

                                    let oldEdgesCopy = this.state.edges.slice();
                                    oldEdgesCopy.push({from: 1, to: i + 2});

                                    this.setState({
                                        nodes: oldNodesCopy,
                                        edges: oldEdgesCopy
                                    });

                                    // for (let j = 0; j < Math.min(5, neighborResponse.value[0].Neighbors.length); j++) {
                                    //     const HttpNeighbor2 = new XMLHttpRequest();
                                    //     HttpNeighbor2.open("GET", azureSearchApiUrl + neighborResponse.value[0].Neighbors[j]);
                                    //     HttpNeighbor2.setRequestHeader('api-key', '11A584ECD13C39D335F57939D502673D');
                                    //     HttpNeighbor2.send();
                                    //     HttpNeighbor2.onreadystatechange = (e) => {
                                    //         if (HttpNeighbor2.readyState === 4) {
                                    //             try {
                                    //                 let neighborResponse1 = JSON.parse(HttpNeighbor2.responseText);
                                    //                 let oldNodesCopy1 = this.state.nodes.slice();
                                    //                 oldNodesCopy1.push({id: j + 12, label: neighborResponse1.value[0].Title, shape: 'image', image: neighborResponse1.value[0].PrimaryImageUrl});
                
                                    //                 let oldEdgesCopy1 = this.state.edges.slice();
                                    //                 oldEdgesCopy1.push({from: i + 2, to: j + 12});
                
                                    //                 this.setState({
                                    //                     nodes: oldNodesCopy1,
                                    //                     edges: oldEdgesCopy1
                                    //                 });
                                    //             } catch (e) {
                                    //                 console.log('malformed request:' + HttpNeighbor2.responseText);
                                    //             }
                                    //         }
                                    //     }
                                    // }

                                } catch (e) {
                                    console.log('malformed request:' + HttpNeighbor.responseText);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }

    render(){
        return(
            <Grid
            fill="vertical"
            areas={[
                { name: 'search', start: [0, 0], end: [0, 0] },
                { name: 'tags', start: [0, 1], end: [0, 1] },
                { name: 'display', start: [1, 0], end: [1, 1] },
                { name: 'right', start: [2, 0], end: [2, 1] },
            ]}
            columns={['medium','flex','small']}
            rows={['small','flex']}
            gap='small'
            >
                <Box gridArea='search' background="brand" >
                    <SearchControl sendChange={this.getChange}/>
                </Box>
                <Box gridArea='tags' >
                    <TagList tags={this.state.tags} tagData={this.state.tagData} tagChange={this.getTagChange}/>
                </Box>
                <Box gridArea='right' />
                <Box gridArea='display' background="accent-1" >
                    <ImageGraph nodes={this.state.nodes} edges={this.state.edges}/>
                </Box>    
            </Grid>
        );


    };
}