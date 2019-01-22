import React, { Component } from 'react';

import styled from "styled-components";

import { Box, Button, Text } from 'grommet';

const NavBox = styled(Box)`
    padding: 2rem;
`
/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component{
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <NavBox
                direction='row'
                align='center'
                justify='start'
                elevation='medium'
                fill='horizontal'
                background="brand"
            >
                <Button hoverIndicator="false" style={{textDecoration: "none"}} href={"/"}>
                    <Text size="42px" style={{ fontFamily:"monospace"}}>
                        Deep Art
                    </Text>
                </Button>

            </NavBox>

        );
    }
}