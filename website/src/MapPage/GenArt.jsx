import React, { Component } from 'react';
import { saveAs } from 'file-saver';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';

import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * The box containing the generated image
 * 'image' prop: The generated image, in base64 encoded ArrayBuffer format
 */
export default class GenArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 0,
      objID: 0,
      redirect: false,
    };
    this.saveImage = this.saveImage.bind(this);
    this.getSimilarArtID = this.getSimilarArtID.bind(this);
    this.coordToCantorPair = this.coordToCantorPair.bind(this);
  }

  saveImage() {
    let number = Math.floor(Math.random() * 10000);
    let blob = new Blob([this.props.data], { type: 'image/jpeg' });

    saveAs(blob, 'image' + number.toString() + '.jpeg');
  }

  coordToCantorPair(x, y) {
    let intX = x * 1000;
    let intY = y * 1000;
    let pairing = 0.5 * (intX + intY) * (intX + intY + 1) + intY;
    return pairing;
  }

  getSimilarArtID() {
    //let file = new File([this.props.data], "image.jpeg", {type: "image/jpeg"});
    let file = this.props.image;

    //const apiURL = 'https://imagedocker2.azurewebsites.net/FindSimilarImages/Byte';
    //const apiURL = 'https://metimagesearch.azurewebsites.net/neighbors?neighbors=1';
    const apiURL = 'https://gen-studio-apim.azure-api.net/met-reverse-search/FindSimilarImages/Byte';
    const key = '?subscription-key=7c02fa70abb8407fa552104e0b460c50&neighbors=1';
    const Http = new XMLHttpRequest();
    const data = new FormData();
    data.append('image', file);

    Http.open('POST', apiURL + key);
    Http.send(data);
    Http.onreadystatechange = e => {
      if (Http.readyState === 4) {
        try {
          let response = JSON.parse(Http.responseText);
          let id = response.results[0].ObjectID;
          if (id === undefined || id === null) {
            id = 0;
          }

          this.setState({
            objID: id,
            redirect: true,
          });
        } catch (e) {
          console.log('malformed request:' + Http.responseText);
        }
      }
    };
  }

  render() {
    const ImageBox = () => (
      <img
        src={'data:image/jpeg;base64,' + this.props.image}
        fit="contain"
        style={{ zIndex: '-1' }}
        alt={this.props.image.id}
      />
    );

    let aux = window.location.pathname.split('/')[2];
    let shareUrl = window.location.href.replace(aux,encodeURIComponent(decodeURIComponent(aux)));
    let smMessage = "Look at the new art that I've just created";

    let loadOrImage = this.props.image === 0 || this.props.image === null || this.props.image === undefined ? (<CircularProgress style={{ color: '#6A6A6A' }} />) : (<ImageBox />);
    let message = this.props.point === null ? ('') : (<p>{this.props.message}</p>);
    if (this.state.redirect) {
      let link = `/search/${this.state.objID}`;
      return <Redirect push to={link} />;
    } else {
      return (
        <div className="gen-art">
          <div className="gen-art__header">Generated Image</div>
          <div className="gen-art__loader">
            {loadOrImage}
          </div>
          <div className="gen-art__message">
            {message}
          </div>
          <button className="button" onClick={this.getSimilarArtID}>{this.props.t("map.similar")}</button>
          <button className="button" onClick={this.saveImage}>{this.props.t("map.save")}</button>
          <div className="gen-art__share">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={36} iconBgStyle={{fill:'#000000'}}/>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={smMessage}>
              <TwitterIcon size={36} iconBgStyle={{fill:'#000000'}}/>
            </TwitterShareButton>
          </div>
        </div>
      );
    }
  }
}
