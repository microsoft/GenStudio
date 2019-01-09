import React, { Component } from 'react';

import styled from "styled-components";

import { Box, Layer, Text } from 'grommet';

const NavBox = styled(Box)`
    padding: 3rem;
    background-color: #e4002b;
`

export default class NavBar extends Component{
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <NavBox
                direction='row'
                align='center'
                justify='center'
                elevation='medium'
                fill='horizontal'
            >
                <Text size="xxlarge" style={{color: "white"}}>
                    Deep Art
                </Text>
            </NavBox>

        );
    }
}