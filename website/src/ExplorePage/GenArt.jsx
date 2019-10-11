import React, { Component } from "react";
import { saveAs } from "file-saver";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';

import { Redirect } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";

/**
 * The box containing the generated image
 * 'image' prop: The generated image, in base64 encoded ArrayBuffer format
 */
export default class GenArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 0,
      objIDs: [],
      redirect: false
    };
    this.getSimilarArtID = this.getSimilarArtID.bind(this);
    this.saveImage = this.saveImage.bind(this);
  }

  
  jsonToURI(json){ return encodeURIComponent(JSON.stringify(json)); }

  getSimilarArtID() {
    let file = this.props.image;

    const apiURL = 'https://gen-studio-apim.azure-api.net/met-reverse-search-2/FindSimilarImages/Byte';
    const key = '?subscription-key=7c02fa70abb8407fa552104e0b460c50&neighbors=20';
    const Http = new XMLHttpRequest();
    const data = new FormData();
    data.append('image', file);

    Http.open('POST', apiURL + key);
    Http.send(data);
    Http.onreadystatechange = e => {
      if (Http.readyState === 4) {
        try {
          let response = JSON.parse(Http.responseText);
          let ids = response.results.map(result => result.ObjectID);
          this.setState({
            objIDs: ids,
            redirect: true,
          });
        } catch (e) {
          console.log('malformed request:' + Http.responseText);
        }
      }
    };
  }

  saveImage() {
    let number = Math.floor(Math.random() * 10000);
    let blob = new Blob([this.props.data], { type: 'image/jpeg' });

    saveAs(blob, 'image' + number.toString() + '.jpeg');
  }

  render() {
    let loadOrImage =
      this.props.image === 0 ||
      this.props.image === null ||
      this.props.image === undefined ? (
        <CircularProgress style={{ color: "#6A6A6A" }} />
      ) : (
        <img
          src={"data:image/jpeg;base64," + this.props.image}
          fit='cover'
          alt={this.props.image.id}
          style={{ zIndex: "-1" }}
        />
      );
    
    let aux = window.location.pathname.split('/')[2];
    let shareUrl = window.location.href.replace(aux,encodeURIComponent(decodeURIComponent(aux)));
    let smMessage = "Look at the new art that I've just created";

    if (this.state.redirect) {
      let link = `/search/${this.jsonToURI(this.state.objIDs)}`;
      return <Redirect push to={link} />;
    } else {
      return (
        <div className='gen-art'>          
          <div className="gen-art__header">Generated Image</div>
          <div className='gen-art__loader'>
            {loadOrImage}
          </div>
          <button className='button' onClick={this.getSimilarArtID}>{this.props.t("map.similar")}</button>
          <button className='button' onClick={this.saveImage}>{this.props.t("map.save")}</button>
          <div className="gen-art__share">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={36} iconBgStyle={{fill:'#000000'}}
                />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={smMessage}>
                <TwitterIcon size={36} iconBgStyle={{fill:'#000000'}}
                />
              </TwitterShareButton>
          </div>
        </div>
      );
    }
  }
}
