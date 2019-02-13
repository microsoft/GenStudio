import React, { Component } from "react";
import GenArt from "./GenArt.jsx";
import setupPlotly from "./map.js";

import MapExploreContainer from "../MapExploreContainer/MapExploreContainer.jsx";

/**
 * A map explore page to explore the latent space of BigGAN
 */
// export default class MapExplorePage extends Component {
class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPoint: null,
      imgData: "",
      apiData: {}
    };
  }

  componentDidMount() {
    //Decode the url data
    let url = this.props.match.params.id.toString();
    url = decodeURIComponent(url);
    let selectedArt = url.split("&")[0].slice(4);
    let artArr = url.split("&")[1].slice(4);
    artArr = JSON.parse(artArr);
    const id = selectedArt;
    //Setup the Plotly graph
    setupPlotly(this, artArr, selectedArt);
    this.getArtworkInfo(id);
  }

  getArtworkInfo = (id) => {
    console.log(id)
    const baseMetUrl =
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
    let metApiUrl = baseMetUrl + id;

    const Http = new XMLHttpRequest();
    Http.open("GET", metApiUrl);
    Http.send();
    Http.onreadystatechange = e => {
      if (Http.readyState === 4) {
        try {
          let response = JSON.parse(Http.responseText);
          this.setState({
            imgData: response.primaryImage,
            apiData: response
          }, () => console.log(this.state));
        } catch(e) {
          console.log("malformed request:" + Http.responseText);
        }
      }
    }
  }

  render() {
    return (
      <MapExploreContainer map={true} location={this.props.location} apiData={this.state.apiData} imgData={this.state.imgData}>
        <div className='map__result'>
          <GenArt
            message={this.state.message}
            image={this.state.genImg}
            data={this.state.genArr}
          />
          <div className='plot' id='myPlot' />
        </div>
      </MapExploreContainer>
    );
  }
}

export default MapPage;
