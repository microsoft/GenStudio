import React, { Component } from 'react';

/**
 * The box containing the normal art Image
 * 'image' prop: the image to be displayed, in url formal
 */
export default class InfoArt extends Component {

    render(){
        return(
            <img src={this.props.image}/>
        );
    }
}
