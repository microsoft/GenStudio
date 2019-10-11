import React, { Component } from 'react';
import ResultBox from './ResultBox.jsx';

/**
 * Grid used to display results of a search
 * 'results' prop: an array of the json results from the Azure search (the 'value' value)
 */
export default class SearchGrid extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.results.map(result => (
          <ResultBox key={result.Object_ID} data={result} />
        ))}
      </React.Fragment>
    );
  }
}
