import React, { Component } from 'react';
// import { Box, Button, Image, Text} from 'grommet';
import CircularProgress from '@material-ui/core/CircularProgress';
import LazyLoad from 'react-lazyload';

/**
 * One box in the Result Grid
 * 'data' prop: json object from azure search index {@search.score, ObjectID, Department, Title, Culture, Medium, Classification, LinkResource, PrimaryImageUrl, Neighbors}
 */
export default class ResultBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //Material UI version
  render() {
    let media =
      this.props.data.PrimaryImageURL === undefined || this.props.data.PrimaryImageURL === null ? (
        <LazyLoad
          throttle={250}
          height={500}
          placeholder={<CircularProgress style={{ color: '#6A6A6A' }} />}
        >
          <img className="grid-card__img" src={this.props.data.PrimaryImageUrl}/>
        </LazyLoad>
      ) : (
        <CircularProgress style={{ color: '#6A6A6A' }} />
      );

    return (
      <div class="grid-card">
        <a className="grid-card__link" href={this.props.data.LinkResource} target="_blank" rel="noopener noreferrer">{media}</a>
        <p className="grid-card__title">{this.props.data.Title}</p>
        <p className="grid-card__text">{this.props.data.Department}</p>
      </div>
    );
  }
}
