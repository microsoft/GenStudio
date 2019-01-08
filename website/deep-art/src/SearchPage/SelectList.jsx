import React, { Component } from 'react';
import styled from "styled-components";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default class SelectList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: 0
        };
    };

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
        this.props.changeSelect(index);
    };

    render(){
        return(
        <div>
            <List>

                <ListItem
                    button
                    selected={this.state.selectedIndex === 0}
                    onClick={event => this.handleListItemClick(event, 0)}
                >
                    <ListItemText primary="Vase" />
                </ListItem>

                <ListItem
                    button
                    selected={this.state.selectedIndex === 1}
                    onClick={event => this.handleListItemClick(event, 1)}
                >
                    <ListItemText primary="Landscape" />
                </ListItem>

                <ListItem
                    button
                    selected={this.state.selectedIndex === 2}
                    onClick={event => this.handleListItemClick(event, 2)}
                >
                    <ListItemText primary="Portrait" />
                </ListItem>

            </List>

        </div>    
        );
    }
}