import React, { Component } from 'react';
import { NamespacesConsumer } from 'react-i18next';
import {NavLink} from 'react-router-dom';
import ArtworkInfo from "./ArtworkInfo.jsx";

class MapExploreContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {}
    };
  }

  componentDidMount() {
    let url = this.props.location.pathname.split('/')[2]
    //Decode the url data
    url = decodeURIComponent(url);
    let selectedArt = url.split("&")[0].slice(4);
    const id = selectedArt;
    this.getArtworkInfo(id);
  }

  getArtworkInfo = (id) => {
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
            imgData: response.primaryImageSmall,
            apiData: response
          });
        } catch(e) {
          console.log("malformed request:" + Http.responseText);
        }
      }
    }
  }

  generatePath = (page) => {
    const pathname = this.props.location.pathname.split('/')[2]
    return `/${page}/${pathname}`
  }

  renderHeader = () => {
    const getClass = (page, isMapPage) => {
      if (page === 'map' && isMapPage) {
        return "map__tab is-active"
      } else if (page === 'explore' && !isMapPage) {
        return "map__tab is-active"
      } else {
        return "map__tab"
      }
    }
    return (
      <React.Fragment>
        <div className="map__header">
          {/* <button onClick={this.generatePath} id='map' className={getClass('map', this.props.map)}><NavLink to={this.generatePath('map')}>Map</NavLink></button>
          <button onClick={this.generatePath} id='explore' className={getClass('explore', this.props.map)}><NavLink to={this.generatePath('explore')}>Explore</NavLink></button> */}
          <NavLink onClick={this.generatePath} id='map' className={getClass('map', this.props.map)} to={this.generatePath('map')}>Map</NavLink>
          <NavLink onClick={this.generatePath} id='explore' className={getClass('explore', this.props.map)} to={this.generatePath('explore')}>Explore</NavLink>
        </div>
      </React.Fragment>
    )
  }

  renderArtworkInfo = (t) => {
    return (
      <ArtworkInfo
        t={t}
        apiData={this.state.apiData}
      />
    )
  }

  render () {
    return (
      <NamespacesConsumer>
        {t => (
          <section className='map'>
          {this.renderHeader()}
          <div className='map__content'>
            <h1 className='claim'>{t("map.title")}</h1>
            <div className='map__data'>
              <p className='map__description'>{t("map.description")}</p>
              {this.state.apiData && this.renderArtworkInfo(t)}
            </div>
            {this.props.children(t)}
          </div>
        </section>
        )}
      </NamespacesConsumer>
    )
  }
}

export default MapExploreContainer;
