import React, { Component } from 'react';

import Slider from 'react-slick';

/**
 * The grid of thumbnails of art
 *  images : List of ObjIDs to be displayed
 *  selectedImage : the currently selected image
 *  selectImage : callback to change the selected image
 *  categorySelected : the selected category
 */
export default class ResultArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedID: 0,
    };
  }

  render() {
    const settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      centerPadding: '60px',
      slidesToShow: 5,
      speed: 500,
    };

    let imagesToDisplay = this.props.images;
    if (this.props.categorySelected) {
      imagesToDisplay = imagesToDisplay.slice(0, 6);
    }

    const listItems = imagesToDisplay.map((image, i) => (
      <React.Fragment key={image.id}>
        <img
          className="slick-img"
          src={image.img}
          alt={image.id}
          onClick={() => {this.props.selectImage(image.key, image.id);}}
          style={this.props.selectedImage.key === image.key ? { borderColor: '#002050', borderSize: '2px' } : { borderColor: '#ffffff', borderSize: '2px' }}
        />
      </React.Fragment>
    ));

    return <Slider {...settings}>{listItems}</Slider>;
  }
}
