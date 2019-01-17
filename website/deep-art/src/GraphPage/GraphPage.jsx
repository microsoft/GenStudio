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
            tagData: {"a": false, "b": false, "c": false}
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

    render(){

        let nodes= [
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
          ];
        let edges= [
            {from: 1, to: 2},
            {from: 1, to: 3},
            {from: 2, to: 4},
            {from: 2, to: 5}
          ];

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
                <Box gridArea='display' background="accent-1" >
                    <ImageGraph nodes={nodes} edges={edges}/>
                </Box>

                <Box gridArea='right' />
    
            </Grid>
        );


    };

}