import React, { Component } from 'react';

/**
 * List of tags that can be used to filter results
 */
export default class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (event, category, value) => {
    this.props.toggleFilter(category, value);
  };

  isChecked(selectedFilters, name, value) {
    if (selectedFilters[name] != null) {
      return selectedFilters[name].has(value)
     } else {
      return false
    }    
  }

  render() {
    return (
      <React.Fragment>
        <button className="button2" onClick={this.props.clearActiveFilters}>Clear Active Filters</button>
        <h4>Active Filters</h4>
        {Object.entries(this.props.activeFilters).map(([name,filterValues],) => 
          <React.Fragment>
            <div className="search__row_category" ><b>{name}</b></div> 
            {[...filterValues].map(filterValue =>
                <div className="search__row" key={name + filterValue} >
                  <label className="search__label" htmlFor={name + filterValue}>{filterValue}</label>
                </div>
            )}
          </React.Fragment>
        )}
        <button className="button2" onClick={this.props.applySelectedFilters}>Apply Selected Filters</button>
        {Object.entries(this.props.facets).map(([name,facetEntries],) => 
          <React.Fragment>
            <div className="search__row_category" ><b>{name}</b></div> 
            {facetEntries.map(facetInfo =>
              <div className="search__row" key={facetInfo.value} >
                <input 
                  className="search__checkbox"
                  type="checkbox" id={facetInfo.value}
                  checked={this.isChecked(this.props.selectedFilters, name, facetInfo.value)} 
                  onChange={e => this.onChange(e, name, facetInfo.value)} />
                <label className="search__label" htmlFor={facetInfo.value}>{facetInfo.value + `(${facetInfo.count})`}</label>
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
