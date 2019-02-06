import React, { Component } from "react";

import Slider from "react-slick";

export default class HomeSlider extends Component {
  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <h3>Slide: 1</h3>
          </div>
          <div>
            <h3>Slide: 2</h3>
          </div>
          <div>
            <h3>Slide: 3</h3>
          </div>
          <div>
            <h3>Slide: 4</h3>
          </div>
          <div>
            <h3>Slide: 5</h3>
          </div>
          <div>
            <h3>Slide: 6</h3>
          </div>
        </Slider>
      </div>
    );
  }
}
