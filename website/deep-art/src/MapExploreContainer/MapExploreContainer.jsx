import React, { Component } from 'react';
import GenArt from './GenArt.jsx';
import { NamespacesConsumer } from 'react-i18next';

class MapExploreContainer extends Component {
  
  generatePath = () => {
    const pathname = this.props.location.pathname
    console.log(pathname)
  }

  renderHeader = () => {
    return this.props.map ?
      (
        <div className="map__header">
          <button className="map__tab is-active">Map</button>
          <button className="map__tab">Explore</button>
        </div>
      ) :
      (
        <div className="map__header">
          <button className="map__tab">Map</button>
          <button className="map__tab is-active">Explore</button>
          {/* <button className="map__tab" href={'/explore'}>Method 2</button> */}
        </div>
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
                <p className="map__description">{t('map.description')}</p>
                <div className="map__original">
                  test asdasdasdas
                </div>
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