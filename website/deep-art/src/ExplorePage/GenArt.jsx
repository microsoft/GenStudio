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
      objID: 0,
      redirect: false
    };
    this.getSimilarArtID = this.getSimilarArtID.bind(this);
    this.saveImage = this.saveImage.bind(this);
  }

  getSimilarArtID() {
    let file = this.props.image;

    const apiURL =
      "https://methack-api.azure-api.net/ImageSimilarity/FindSimilarImages/Byte";
    const key =
      "?subscription-key=43d3f563ea224c4c990e437ada74fae8&neighbors=1";
    const Http = new XMLHttpRequest();
    const data = new FormData();
    data.append("image", file);

    Http.open("POST", apiURL + key);
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
            redirect: true
          });
        } catch (e) {
          console.log("malformed request:" + Http.responseText);
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
    
    let shareUrl = encodeURI(window.location.href);

    if (this.state.redirect) {
      let link = `/search/${this.state.objID}`;
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
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={36} iconBgStyle={{fill:'#000000'}}
                />
              </TwitterShareButton>
          </div>
        </div>
      );
    }
  }
}
