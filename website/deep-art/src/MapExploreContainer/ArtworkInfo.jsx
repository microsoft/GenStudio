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
        <p className='original__data'>
          <div className='original__title'>{t("map.time")}:</div>
          <div className='original__text'>{artistDisplayName || "Unknown"}</div>
        </p>
        <time className='original__data'>
          <div className='original__title'>{t("map.date")}: </div>
          <div className='original__text'>{objectDate || "Unknown"}</div>
        </time>
      </div>
    </div>
  );
  // return (
  //   <div className="artwork-info">
  //     <img className="artwork-info__image" src={imgData} alt={apiData.objectName}/>
  //     <div className="artwork-info__detail">
  //       <p className="artwork-info__label artwork-info__title">{title ? title : 'Unknown'}</p>
  //       <div><p className="artwork-info__label">Date:</p><span>{objectDate ? objectDate : 'Unknown'}</span></div>
  //       <div><p className="artwork-info__label">Artist:</p><span>{artistDisplayName ? artistDisplayName : 'Unknown'}</span></div>
  //     </div>
  //   </div>
  // );
};

export default ArtworkInfo;
