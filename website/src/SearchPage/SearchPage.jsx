import React, { Component } from 'react';

import { Box, Grid} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';

const maxSearchResults = 30;
const minTagLength = 2;
const maxTagLength = 60;
const urlRegEx =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const azureSearchUrl = 'https://metartworksindex.search.windows.net/indexes/met-items/docs?api-version=2017-11-11&search=';
const apiKey = '11A584ECD13C39D335F57939D502673D';

/**
 * Page for searching the MET collection
 */
export default class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: "", // Current search query to be displayed
            tags: [], // All current tags to be displayed
            tagData: {}, // On/Off state of all tags currently displayed
            results: [] // All current search query results to be displayed
        };
        this.extractValidObjects = this.extractValidObjects.bind(this);
        this.updateGridDisplay = this.updateGridDisplay.bind(this);
        this.getTagChange = this.getTagChange.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.isValidUrl = this.isValidUrl.bind(this);
        this.getSearch = this.getSearch.bind(this);
    };

    componentDidMount() {
        //Does an initial search if given an ObjID
        let self = this;
        let {id} = this.props.match.params; // The ID of the image to search on
        if (id != null && id !== 0) { // Do not update for null or '0' ids
            fetch(azureSearchUrl + id, {headers: {'api-key': apiKey}}).then(function(response) {
                return response.json();
            }).then(function(responseJson) {
                if (responseJson.value.length > 0) { // Only display searches with one or more results
                    let initSearchQuery = responseJson.value[0].Title;
                    const titleTokens = initSearchQuery.match(/\w+(?:'\w+)*/g); // Extract all individual words from the initial search query
    
                    if (titleTokens != null) { // Some art have no titles
                        initSearchQuery += '||';
        
                        for (let i = 0; i < titleTokens.length; i++) { // Or operator between all words in the search query
                            initSearchQuery += titleTokens[i] + '||';
                        }
                        
                        initSearchQuery = initSearchQuery.substring(0, initSearchQuery.length - 2); // Trim off extra Or operator
                        initSearchQuery = encodeURIComponent(initSearchQuery);
                        self.getSearch(initSearchQuery);
                        return;
                    }
                }
                self.getSearch('*'); // Search for anything
            })
        }
    }

    /**
     * This function creates a brand new search query request and refreshes all tags and results in the current state
     * @param newSearchValue the new search query
     */
    getSearch(newSearchValue) {
        let self = this;
        fetch(azureSearchUrl + newSearchValue, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            let objectList = self.extractValidObjects(responseJson);
            self.updateGridDisplay(objectList);
            self.updateTags(objectList);
            self.setState((oldState) => {
                return oldState.searchValue = newSearchValue;
            });
        })
    }
    
    /**
     * This function takes in a JSON object returned from an Azure search index request and extracts the results 
     * list of objects that have valid image and resource URLs
     * @param responseJson a JSON object from an Azure search index query
     * @returns a list of objects with valid URLs
     */
    extractValidObjects(responseJson) {
        let objectList = [];
        for (let i = 0; i < responseJson.value.length && objectList.length < maxSearchResults; i++) {
            if (this.isValidUrl(responseJson.value[i].PrimaryImageUrl) && this.isValidUrl(responseJson.value[i].LinkResource)) { // Extract all objects with a valid image and resource Urls
                objectList.push(responseJson.value[i]);
            }
        }
        return objectList;
    }
    
    /**
     * This function returns true iff the passed in string is a valid URL
     * @param string the string to be analyzed
     * @returns true iff the string is a URL, otherwise false
     */
    isValidUrl(string) {
        return urlRegEx.test(string);
    }

    /**
     * This function updates the result prop in the current state to the passed in object list
     * @param objectList the new result list of objects to be displayed
     */
    updateGridDisplay(objectList) {
        this.setState((oldState) => {
            return oldState.results = objectList;
        });
    }

    /**
     * This function creates and updates the tags and tagData props in the state to reflect the results in the objectList param
     * @param objectList the list of objects to source the new tags from
     */
    updateTags(objectList) {
        let self = this;
        const newTags = [];
        const newTagData = {};
        for (let i = 0; i < objectList.length; i++) {
            const data = [objectList[i].Culture, objectList[i].Medium, objectList[i].Classification]; // New tags dynamically created from objects' culture, medium, and classification data
            for (let j = 0; j < data.length; j++) {
                if (data[j] != null && minTagLength < data[j].length && data[j].length < maxTagLength && !(data[j] in newTagData)) { // Filter out unwanted tags
                    newTags.push(data[j]);
                    newTagData[data[j]] = false;
                }
            }
        }
        self.setState({tags: newTags, tagData: newTagData});
    }

    /**
     * This function is called when a user selects a tag to indlude/exclude in a new search query. This function updates the UI to reflect 
     * that tag change and then creates a new search request including/excluding that tag, updating the state's tag, tagData, and results list 
     * props according to the new results.
     * @param label the tag that was selected by the user
     * @param value set to true to include this tag in the new search query, false to exclude
     */
    getTagChange(label, value) {
        let self = this;
        let searchTags = '';
        const oldTagData = this.state.tagData;
        oldTagData[label] = value;
        self.setState({tagData: oldTagData});
        
        for (const [key, value] of Object.entries(this.state.tagData)) {
            if (value) {
                const searchTokens = key.match(/\w+(?:'\w+)*/g); // Extract all individual words from tags
                searchTags += '&&' + '(';
                for (let i = 0; i < searchTokens.length; i++) {
                    searchTags += searchTokens[i] + '||'; // Concat all individual words in a selected tag with 'Or' operator 
                }
                searchTags = searchTags.substring(0, searchTags.length - 2); // Trim off extra 'Or' operator
                searchTags += ')';
                searchTags = encodeURIComponent(searchTags);
            }
        }

        fetch(azureSearchUrl + this.state.searchValue + searchTags, {headers: {'api-key': apiKey}}).then(function(response) {
            return response.json();
        }).then(function(responseJson) {
            let objectList = self.extractValidObjects(responseJson);
            self.updateGridDisplay(objectList);
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
            rows={['xsmall','flex']}
            gap='small'
            style={{paddingLeft: "3rem", paddingRight: "3rem"}}
            >
                <Box gridArea='search' background="accent-3" style={{justifyItems: "center"}}>
                    <SearchControl sendChange={this.getSearch}/>
                </Box>

                <Box gridArea='tags' background="accent-3" style={{justifyItems: "start"}}>
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