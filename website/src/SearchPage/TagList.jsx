import React, { Component } from 'react';

/**
 * List of tags that can be used to filter results
 */
export default class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (event, label) => {
    this.props.tagChange(label, event.target.checked);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.tags.map(label => (
          <div className="search__row" key={label} >
            <input className="search__checkbox" type="checkbox" id={label} checked={this.props.tagData[label]} onChange={e => this.onChange(e, label)} />
            <label className="search__label" htmlFor={label}>{label}</label>
          </div>
        ))}
      </React.Fragment>
    );
  }
}
