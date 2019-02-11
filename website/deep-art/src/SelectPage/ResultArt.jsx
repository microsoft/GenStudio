import React, { Component } from 'react';

import Slider from 'react-slick';

import { Button } from 'grommet';

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
      slidesToShow: 3,
      speed: 500,
    };

    let imagesToDisplay = this.props.images;
    if (this.props.categorySelected) {
      imagesToDisplay = imagesToDisplay.slice(0, 6);
    }

    const listItems = imagesToDisplay.map((image, i) => (
      <img
        className="slick-img"
        src={image.img}
        alt={image.id}
        key={i}
        onClick={() => {this.props.selectImage(image.key, image.id);}}
        border={this.props.selectedImage.key === image.key ? { color: '#002050', size: '2px' } : { color: '#ffffff', size: '2px' }
        }
      />
    ));

    return <Slider {...settings}>{listItems}</Slider>;
  }
}
