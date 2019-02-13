import React, { Component } from 'react';
import { NamespacesConsumer } from 'react-i18next';
import {NavLink} from 'react-router-dom';
import ArtworkInfo from "./ArtworkInfo.jsx";

class MapExploreContainer extends Component {
  
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
          <button onClick={this.generatePath} id='map' className={getClass('map', this.props.map)}><NavLink to={this.generatePath('map')}>Map</NavLink></button>
          <button onClick={this.generatePath} id='explore' className={getClass('explore', this.props.map)}><NavLink to={this.generatePath('explore')}>Explore</NavLink></button>
        </div>
      </React.Fragment>
    )
  }

  renderArtworkInfo = () => {
    return (
      <ArtworkInfo
        apiData={this.props.apiData}
        imgData={this.props.imgData}
      /> 
    )
  }

  render () {
    return (
      <NamespacesConsumer>
        {t => (
          <section className="map">
            {this.renderHeader()}
            <div className="map__content">
              <h1 className="claim">{t('map.title')}</h1>
              <div className="map__data">
                <p className="map__description">{t('map.description')}></p>
                {this.props.apiData && this.renderArtworkInfo(this.props.apiData, this.props.imgData)}
                
              </div>
              {this.props.children}
            </div>
          </section>
        )}
      </NamespacesConsumer>
    )
  }
}

export default MapExploreContainer;