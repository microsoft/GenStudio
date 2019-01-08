import React, { Component } from 'react';
import styled from "styled-components";

import SelectList from './SelectList.jsx';
import ResultArt from './ResultArt.jsx';

import landscape from '../images/testLandscape.jpg';
import portrait from '../images/testPortrait.jpg';
import vase from '../images/testVase.jpg';
import error from '../images/testError.png';


const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`

export default class SearchPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedIndex: 0
        };

        this.changeSelect = this.changeSelect.bind(this);
    };

    changeSelect(index){
        this.setState({ selectedIndex: index });
    }

    genResult(){
        switch(this.state.selectedIndex){
            case 0:
                return <ResultArt image={vase} title={'Vase'}/>;
            case 1:
                return <ResultArt image={landscape} title={'Landscape'}/>;
            case 2:
                return <ResultArt image={portrait} title={'Portrait'}/>;
            default:
                return <ResultArt image={error} title={'Error'}/>; 
        }
    }

    render(){
        
        let result = this.genResult();



        return(
            <ColumnsDiv>
                <SelectList changeSelect={this.changeSelect}/>
                {result}
            </ColumnsDiv>
        );
    }
}