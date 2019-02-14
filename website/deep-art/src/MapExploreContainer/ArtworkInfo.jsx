import React from "react";

//TODO translations for unknown values
const ArtworkInfo = ({ apiData, t }) => {
  const { artistDisplayName, objectName, primaryImageSmall, objectDate, title } = apiData;

  return (
    <div className='original'>
      <img
        className='original__img'
        src={primaryImageSmall || "Unknown"}
        alt={objectName || "Unknown"}
      />
      <div className='original__content'>
        <p className='original__description'>{title}</p>
        <time className='original__data'>
          <div className='original__title'>{t("map.date")}: </div>
          <div className='original__text'>{objectDate || "Unknown"}</div>
        </time>
        <p className='original__data'>
          <span className='original__title'>{t("map.artist")}:</span>
          <span className='original__text'>{artistDisplayName || "Unknown"}</span>
        </p>
      </div>
    </div>
  );
};

export default ArtworkInfo;
