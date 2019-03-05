import React, { Component } from "react";
import GenArt from "./GenArt.jsx";
import {setupPlotly, destroyPlotly} from "./map.js";

import MapExploreContainer from "../MapExploreContainer/MapExploreContainer.jsx";
import {AppInsights} from "applicationinsights-js"

/**
 * A map explore page to explore the latent space of BigGAN
 */
// export default class MapExplorePage extends Component {
class MapPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cursorPoint: null,
      url: ''
    };
    AppInsights.downloadAndSetup({ instrumentationKey: "7ca0d69b-9656-4f4f-821a-fb1d81338282" });
    AppInsights.trackPageView("Map Page");
  }

  componentDidMount() {
    //Decode the url data
    let url = this.props.match.params.id.toString();
    url = decodeURIComponent(url);
    let selectedArt = url.split("&")[0].slice(4); //gives id of artwork
    let artArr = url.split("&")[1].slice(4);
    artArr = JSON.parse(artArr);
    //Setup the Plotly graph
    setupPlotly(this, artArr, selectedArt);
    this.setState({url})
  }

  componentWillUnmount() {
    destroyPlotly();
  }

  setDateFormat() {}

  render() {
    return (
      <MapExploreContainer map={true} location={this.props.location}>
        {t => (
          <>
            <GenArt
              t={t}
              message={this.state.message}
              image={this.state.genImg}
              data={this.state.genArr}
            />

            <div className='map__plot'>
              <div className='map__plot-header'>{t("map.explore")}</div>
              <div className='map__plot-graph' id='myPlot' />
            </div>
          </>
        )}
      </MapExploreContainer>
    );
  }
}

export default MapPage;
