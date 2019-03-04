import React, { Component } from 'react';

export default class SearchControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onChange = event => {
    this.setState({ value: event.target.value });
    this.props.sendChange(event.target.value);
  };

  render() {
    const { value } = this.state.value;
    return <input className="search__input" type="search" value={value} placeholder="Search" onChange={this.onChange} />;
  }
}
