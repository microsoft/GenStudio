import React, { Component } from 'react';
import styled from "styled-components";

import { Box, Button, Text} from 'grommet';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const SearchListBox = styled(Box)`
    background-color: #f3f3f3
    `

const MenuButton = ({ label, ...rest }) => {
    return (
      <Button hoverIndicator="background" {...rest}>
        <Box
          direction="row"
          align="center"
          pad="medium"
        >
          <Text size="xxlarge">{label}</Text>
        </Box>
      </Button>
    );
  };

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
            <SearchListBox>
                <MenuButton
                    label="Vase"
                    selected={this.state.selectedIndex === 0}
                    onClick={event => this.handleListItemClick(event, 0)}
                />
                <MenuButton
                    label="Landscape"
                    selected={this.state.selectedIndex === 1}
                    onClick={event => this.handleListItemClick(event, 1)}
                />
                <MenuButton
                    label="Portrait"
                    selected={this.state.selectedIndex === 2}
                    onClick={event => this.handleListItemClick(event, 2)}
                />
            </SearchListBox>

        </div>    
        );
    }
}