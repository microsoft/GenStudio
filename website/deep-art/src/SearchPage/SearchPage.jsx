import React, { Component } from 'react';

import { Box, Button, Grid, Text} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';

export default class GraphPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: "",
            tags: ["a","b","c"],
            tagData: {"a": false, "b": false, "c": false},
            results: []
        };
        this.getChange = this.getChange.bind(this);
        this.getTagChange = this.getTagChange.bind(this);
    };

    componentDidMount(){
        //The ID of the image to search on
        let {id} = this.props.match.params;
    }

    getChange(newSearchValue){
        let thisVar = this;
        const azureSearchUrl = 'https://metartworksindex.search.windows.net/indexes/met-items/docs?api-version=2017-11-11&search=';
        fetch(azureSearchUrl + newSearchValue, {headers: {'api-key': '11A584ECD13C39D335F57939D502673D'}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            thisVar.setState({searchValue: newSearchValue, results: responseJson.value});
        })
    }

    getTagChange(label, value){
        this.setState((oldState) => {
            return oldState.tagData[label] = value;
        });
    }

    render(){
        return(
            <Grid
            fill
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
                    <Button label={"search"} onClick={this.makeSearch} margin="medium"/>
                </Box>

                <Box gridArea='tags' >
                    <TagList tags={this.state.tags} tagData={this.state.tagData} tagChange={this.getTagChange}/>
                </Box>

                <Box gridArea='display'>
                    <Box height="99%">
                        <SearchGrid results={this.state.results}/>
                    </Box>
                </Box>    

                <Box gridArea='right' />
            </Grid>
        );


    };

}