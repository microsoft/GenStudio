import React, { Component } from 'react';

import { Box, Button, Grid, Text} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';

const maxSearchResults = 10;
const azureSearchUrl = 'https://metartworksindex.search.windows.net/indexes/met-items/docs?api-version=2017-11-11&search=';
const apiKey = '11A584ECD13C39D335F57939D502673D';

export default class GraphPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: "",
            tags: [],
            tagData: {},
            results: []
        };
        this.getSearch = this.getSearch.bind(this);
        this.getTagChange = this.getTagChange.bind(this);
        this.updateGridDisplay = this.updateGridDisplay.bind(this);
        this.updateTags = this.updateTags.bind(this);
    };

    getSearch(newSearchValue){
        let thisVar = this; // Hacky
        fetch(azureSearchUrl + newSearchValue, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            thisVar.updateGridDisplay(responseJson);
            thisVar.updateTags(responseJson);
            thisVar.setState((oldState) => {
                return oldState.searchValue = newSearchValue;
            });
        })
    }

    updateGridDisplay(searchJson) {
        this.setState((oldState) => {
            return oldState.results = searchJson.value.slice(0, maxSearchResults);
        });
    }

    updateTags(searchJson) {
        let thisVar = this; // Hacky
        const newTags = [];
        const newTagData = {};
        for (let i = 0; i < searchJson.value.length && i < maxSearchResults; i++) {
            const data = [searchJson.value[i].Culture, searchJson.value[i].Medium, searchJson.value[i].Classification];
            for (let j = 0; j < data.length; j++) {
                if (data[j] != null && data[j].length > 2 && !(data[j] in newTagData)) {
                    newTags.push(data[j]);
                    newTagData[data[j]] = false;
                }
            }
        }
        thisVar.setState({tags: newTags, tagData: newTagData});
    }

    getTagChange(label, value){
        let thisVar = this; // Hacky
        let searchTags = '';
        const oldTagData = this.state.tagData;
        oldTagData[label] = value;
        thisVar.setState({tagData: oldTagData});
        
        for (const [key, value] of Object.entries(this.state.tagData)) {
            if (value) {
                searchTags += '%2B' + key;
            }
        }

        fetch(azureSearchUrl + this.state.searchValue + searchTags, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            thisVar.updateGridDisplay(responseJson);
        })
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
                    <SearchControl sendChange={this.getSearch}/>
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