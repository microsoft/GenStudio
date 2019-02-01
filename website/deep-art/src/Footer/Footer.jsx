import React, { Component } from 'react';

import styled from "styled-components";

import { Box, Button, Text } from 'grommet';

const FootBox = styled(Box)`
    padding-top: 2rem;
    padding-bottom: 2rem;
`

const WrapBox = styled(Box)`
    padding-left: 3rem;
    padding-right: 3rem;
`
/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component{

    render() {
        return(
            <WrapBox>
                <FootBox
                    direction='column'
                    align='center'
                    justify='center'
                    elevation='none'
                    fill='horizontal'
                    style={{alignContent: "space-between"}}
                >
                    <Text size="16px">
                        {"Gen Studio is a prototype concept which was created over a two-day hackathon with collaborators across The Met, Microsoft, and MIT. "} 
                        <Button hoverIndicator={true} href={"https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack"} style={{marginLeft: "5px"}}>
                            <Text size="16px">
                                Click here to learn more.
                            </Text>
                        </Button>
                    </Text>


                </FootBox>
            </WrapBox>

        );
    }
}