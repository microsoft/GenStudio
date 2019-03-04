import React, { Component } from 'react';
import PaletteBox from './PaletteBox.jsx';

/**
 * The Palette used to explore the images
 * 'addSeed' prop: callback to add an image to the current seed
 * 'subSeed' prop: callback to subtract an image from the current seed
 */
export default class ExplorePalette extends Component {
  render() {
    return (
      <div className="explore__grid">
        {this.props.images.map(tile => (
          <PaletteBox
            key={tile.key}
            img={tile.img}
            id={tile.id}
            addSeed={this.props.addSeed}
            subSeed={this.props.subSeed}
          />
        ))}
      </div>
    );
  }
}
