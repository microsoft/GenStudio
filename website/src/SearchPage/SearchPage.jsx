import React, { Component } from 'react';

import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';
import {AppInsights} from "applicationinsights-js"

const facetNames = ["Culture","Department"];
const azureSearchUrl =
  'https://met-search.search.windows.net/indexes/met-index/docs?api-version=2019-05-06&';
const apiKey = 'E05256A72E0904582D2B7671DD7E2E3E';

/**
 * Page for searching the MET collection
 */
export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: ['*'], // Current search query to be displayed
      searchFields: null,
      selectedFilters: {},
      activeFilters: {},
      facets: {},
      results: []
    };
    this.updateTerms = this.updateTerms.bind(this);
    this.clearActiveFilters = this.clearActiveFilters.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.applySelectedFilters = this.applySelectedFilters.bind(this);

    AppInsights.downloadAndSetup({ instrumentationKey: "7ca0d69b-9656-4f4f-821a-fb1d81338282" });
    AppInsights.trackPageView("Search Page");
  }

  filterTerm(col, values) {
    return `search.in(${col},  '${[...values].join("|")}', '|')`
  }

   /**
   * This function creates a brand new search query request and refreshes all tags and results in the current state
   * @param query the new search query
   */
  executeSearch() {
    let query= "&search="+this.state.terms.join('|')

    if (this.state.searchFields!=null){
      query = query+ "&searchFields=" + this.state.searchFields.join(",")
    }
    query = query+facetNames.map(f => "&facet="+f+",count:5").join("")
    
    let filtersToSearch = Object.entries(this.state.activeFilters)
      .filter( ([col, values],) => 
        values.size > 0
      )

    if (filtersToSearch.length !== 0){
      query = query + "&$filter=" +  filtersToSearch.map( ([col, values],) =>
          this.filterTerm(col, values)
        ).join(" or ")
    }

    console.log(query)
    let self = this
    fetch(azureSearchUrl + query, { headers: { 'api-key': apiKey } })
      .then(function(response) {
        return response.json();
      })
      .then(function(responseJson) {
        self.setState({facets:responseJson["@search.facets"], results:responseJson.value})
      });
  }

  componentDidMount() {
    const ids = this.props.match.params.id; // The IDs of the images found by NN
    if (ids != null) {
      this.setState({terms:this.uriToJSON(ids), searchFields:["Object_ID"]}, this.executeSearch)
    } else {
      this.setState({terms:["*"]}, this.executeSearch)
    }
  }

  uriToJSON(urijson) { return JSON.parse(decodeURIComponent(urijson)); }

  updateTerms(newTerms) {
    this.setState({terms: newTerms, searchFields:null}, this.executeSearch)
  }

  clearActiveFilters() {
    this.setState({activeFilters: {}}, this.executeSearch)
  }
  
  toggleFilter(col, value) {
    let oldFilters = this.state.selectedFilters
    if (oldFilters[col] == null){
      oldFilters[col] = new Set()
    }
    if (oldFilters[col].has(value)){
      oldFilters[col].delete(value)
      if (oldFilters[col].size === 0){
        delete oldFilters[col]
      }
    }else{
      oldFilters[col].add(value)
    }
    this.setState({selectedFilters: oldFilters})

  }

  setUnion(a, b){
    return new Set([...a, ...b])
  }

  applySelectedFilters(){
    let af = this.state.activeFilters
    let sf = this.state.selectedFilters
    Object.entries(sf).forEach(([filter, values],) => {
      if (!Object.keys(af).includes(filter)) {
        af[filter] = []
      }
      af[filter] = this.setUnion(af[filter], values)
    })
    this.setState({activeFilters: af, selectedFilters: {}}, this.executeSearch())
  }

  render() {
    return (
      <div className="search">
        <SearchControl updateTerms={this.updateTerms} />
        <div className="search__content">
          <div className="search__tags">
            <TagList
              selectedFilters={this.state.selectedFilters}
              activeFilters={this.state.activeFilters}
              facets={this.state.facets}
              toggleFilter={this.toggleFilter}
              applySelectedFilters={this.applySelectedFilters}
              clearActiveFilters={this.clearActiveFilters}
            />
          </div>
          <div className="search__grid">
            <SearchGrid results={this.state.results} />
          </div>
        </div>
      </div>
    );
  }
}
