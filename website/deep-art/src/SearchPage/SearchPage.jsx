import React, { Component } from 'react';

import { Box, Button, Grid, Text} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';

const maxSearchResults = 30;
const minTagLength = 2;
const maxTagLength = 60;
const urlRegEx =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const azureSearchUrl = 'https://metartworksindex.search.windows.net/indexes/met-items/docs?api-version=2017-11-11&search=';
const apiKey = '11A584ECD13C39D335F57939D502673D';

export default class GraphPage extends Component {

    constructor(props) {
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
        this.isValidUrl = this.isValidUrl.bind(this);
        this.extractValidObjects = this.extractValidObjects.bind(this);
    };

    componentDidMount() {
        let thisVar = this; // Hacky
        let {id} = this.props.match.params; // The ID of the image to search on
        if (id != null && id != 0) { // Do not update for nullor 0 value ids
            fetch(azureSearchUrl + id, {headers: {'api-key': apiKey}}).then(function(response) {
                return response.json();
            }).then(function(responseJson) {
                if (responseJson.value.length > 0) { // Only display searches with one or more results
                    let initSearchQuery = responseJson.value[0].Title;
                    const titleTokens = initSearchQuery.match(/\w+(?:'\w+)*/g); // Extract all individual words from the initial search query
    
                    if (titleTokens != null) { // Some art have no titles
                        initSearchQuery += '||';
        
                        for (let i = 0; i < titleTokens.length; i++) {
                            initSearchQuery += titleTokens[i] + '||';
                        }
                        
                        initSearchQuery = initSearchQuery.substring(0, initSearchQuery.length - 2); // Trim off extra Or operator
                        initSearchQuery = encodeURIComponent(initSearchQuery);
                        thisVar.getSearch(initSearchQuery);
                        return;
                    }
                }
                thisVar.getSearch('*');
            })
        }
    }

    getSearch(newSearchValue) {
        let thisVar = this; // Hacky
        fetch(azureSearchUrl + newSearchValue, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            let objectList = thisVar.extractValidObjects(responseJson);
            thisVar.updateGridDisplay(objectList);
            thisVar.updateTags(objectList);
            thisVar.setState((oldState) => {
                return oldState.searchValue = newSearchValue;
            });
        })
    }
    
    extractValidObjects(responseJson) {
        let objectList = [];
        for (let i = 0; i < responseJson.value.length && objectList.length < maxSearchResults; i++) {
            if (this.isValidUrl(responseJson.value[i].PrimaryImageUrl) && this.isValidUrl(responseJson.value[i].LinkResource)) { // Extract all objects with a valid image and resource Urls
                objectList.push(responseJson.value[i]);
            }
        }
        return objectList;
    }

    isValidUrl(string) {
        return urlRegEx.test(string);
    }

    updateGridDisplay(objectList) {
        this.setState((oldState) => {
            return oldState.results = objectList;
        });
    }

    updateTags(objectList) {
        let thisVar = this; // Hacky
        const newTags = [];
        const newTagData = {};
        for (let i = 0; i < objectList.length; i++) {
            const data = [objectList[i].Culture, objectList[i].Medium, objectList[i].Classification];
            for (let j = 0; j < data.length; j++) {
                if (data[j] != null && data[j].length < maxTagLength && data[j].length > minTagLength && !(data[j] in newTagData)) {
                    newTags.push(data[j]);
                    newTagData[data[j]] = false;
                }
            }
        }
        thisVar.setState({tags: newTags, tagData: newTagData});
    }

    getTagChange(label, value) {
        let thisVar = this; // Hacky
        let searchTags = '';
        const oldTagData = this.state.tagData;
        oldTagData[label] = value;
        thisVar.setState({tagData: oldTagData});
        
        for (const [key, value] of Object.entries(this.state.tagData)) {
            if (value) {
                const searchTokens = key.match(/\w+(?:'\w+)*/g); // Extract all individual words from tags
                searchTags += '&&' + '(';
                for (let i = 0; i < searchTokens.length; i++) {
                    searchTags += searchTokens[i] + '||'; // Or concat all individual words in a selected tag
                }
                searchTags = searchTags.substring(0, searchTags.length - 2); // Trim off extra Or operator
                searchTags += ')';
                searchTags = encodeURIComponent(searchTags);
            }
        }

        fetch(azureSearchUrl + this.state.searchValue + searchTags, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            let objectList = thisVar.extractValidObjects(responseJson);
            thisVar.updateGridDisplay(objectList);
        })
    }

    render() {
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