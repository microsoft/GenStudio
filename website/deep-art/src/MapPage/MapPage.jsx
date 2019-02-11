import React, { Component } from 'react';
import GenArt from './GenArt.jsx';
import setupPlotly from './map.js';

import { NamespacesConsumer } from 'react-i18next';

/**
 * A map explore page to explore the latent space of BigGAN
 */
// export default class MapExplorePage extends Component {
class MapExplorePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cursorPoint: null,
        };
    }

    componentDidMount() {
        //Decode the url data
        let url = this.props.match.params.id.toString();
        url = decodeURIComponent(url);
        let selectedArt = url.split('&')[0].slice(4);
        let artArr = url.split('&')[1].slice(4);
        artArr = JSON.parse(artArr);

        //Setup the Plotly graph
        setupPlotly(this, artArr, selectedArt);
    }

    render() {
        return (
            <NamespacesConsumer>
                {t => (
                    <div className="u-container-centered">
                        <h1 className="claim">{t('map.title')}</h1>
                        <p>{t('map.description')}</p>

                        <GenArt message={this.state.message} image={this.state.genImg} data={this.state.genArr}/>

                        <div id="myPlot" className="plot" />
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default MapExplorePage;
