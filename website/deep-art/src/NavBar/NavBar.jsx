import React, { Component } from 'react';

import styled from "styled-components";

import { Box, Button, Text } from 'grommet';
import logo from '../images/genStudioLogo.png';

const NavBox = styled(Box)`
    padding-top: 2rem;
    padding-bottom: .5rem;
    border-style: solid;
    border-width: 0px 0px 1.5px 0px;
    border-color: #00000;
`

const WrapBox = styled(Box)`
    padding-left: 3rem;
    padding-right: 3rem;
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
            <WrapBox>
                <NavBox
                    direction='row'
                    align='center'
                    justify='start'
                    elevation='none'
                    fill='horizontal'
                    background="#FFFFFF"
                >
                    <img src={logo} style={{height: "32px", width: "32px"}}/>
                    <Button hoverIndicator="false" style={{textDecoration: "none"}} href={"/"}>
                        <Text size="42px" style={{fontWeight: 600}}>
                            Gen Studio
                        </Text>
                    </Button>
                    
                </NavBox>
            </WrapBox>

        );
    }
}