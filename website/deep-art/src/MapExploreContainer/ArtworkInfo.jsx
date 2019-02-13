import React from "react";
import { Box, Paragraph } from "grommet";
import InfoArt from "../ExplorePage/InfoArt.jsx";

//TODO translations for unknown values
const ArtworkInfo = ({ apiData, imgData }) => {
  const {title, objectDate, artistDisplayName} = apiData;
  return (
    <div className="artwork-info">
      <img className="artwork-info__image" src={imgData}/> 
      <div className="artwork-info__detail">
        <p className="artwork-info__label artwork-info__title">{title ? title : 'Unknown'}</p>
        <div><p className="artwork-info__label">Date:</p><span>{objectDate ? objectDate : 'Unknown'}</span></div>
        <div><p className="artwork-info__label">Artist:</p><span>{artistDisplayName ? artistDisplayName : 'Unknown'}</span></div>
      </div>
    </div>
  );
};

export default ArtworkInfo;
