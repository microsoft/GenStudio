import React, { Component } from 'react';

import styled from "styled-components";

import { Box, Text } from 'grommet';

const NavBox = styled(Box)`
    padding: 2rem;
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
                <Text size="42px" style={{ fontFamily:"monospace", color: "white"}}>
                    Deep Art
                </Text>
            </NavBox>

        );
    }
}