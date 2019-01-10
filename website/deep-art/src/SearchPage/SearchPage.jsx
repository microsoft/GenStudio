import React, { Component } from 'react';
import styled from "styled-components";

import SelectList from './SelectList.jsx';
import ResultArt from './ResultArt.jsx';

import { Image } from 'grommet';

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
            selectedIndex: 0,
            imgURLs: []
        };

        this.changeSelect = this.changeSelect.bind(this);

        this.objIDsToImages([69, 438099]);
    };

    changeSelect(index){
        this.setState({ selectedIndex: index });
    }

    /**
     * 
     * @param {Int[]} objIDs - An array of object IDs from the met API to convert to an array of image urls
     * @return {String[]} - An array of image urls from the met API.
     */
    objIDsToImages(objIDs){

        console.log(objIDs);

        
        const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        
        let apiURLs = objIDs.map(ID => (
            baseURL+ID.toString()
        ));

        console.log(apiURLs.toString());

        for (let i = 0; i < apiURLs.length; i++){
            const Http = new XMLHttpRequest();
            Http.open("GET", apiURLs[i]);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4){
                    try {
                        let response = JSON.parse(Http.responseText);
    
                        this.setState((oldState) => {
                            return oldState.imgURLs.push(response.primaryImage)
                        })
                    } catch (e) {
                        console.log('malformed request:' + Http.responseText);
                    }
                }

            }
        }
        //console.log(imgURLs.toString());
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

        console.log(this.state.imgURLs);

        let result = this.genResult();
        return(
            <ColumnsDiv>
                <SelectList changeSelect={this.changeSelect}/>
                <Image src={this.state.imgURLs[0]} fit="contain"/>
                <Image src={this.state.imgURLs[1]} fit="contain"/>
                {result}
                
            </ColumnsDiv>
        );
    }
}