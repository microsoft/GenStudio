import React, { Component } from 'react';

export default class APIHelper {

    constructor(props) {
        this.state = {
            imgObjectsExplore: []
        };

    };

    testMethod() {
        console.log("test fynctuon@@@@!!!");
    }

    objIDsToImages(objIDs) {

        const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';

        let apiURLs = objIDs.map(ID => (
            {
                url: baseURL + ID.toString(),
                id: ID
            }
        ));
        
        for (let i = 0; i < apiURLs.length; i++) {
            const Http = new XMLHttpRequest();
            Http.open("GET", apiURLs[i].url);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4) {
                    try {
                        let response = JSON.parse(Http.responseText);
                        this.state.imgObjectsExplore[i] = {
                            img: response.primaryImage,
                            id: apiURLs[i].id,
                            key: i
                        }
                        console.log("state middle  of fn:" + this.state.imgObjectsExplore);

                        //this.setState((oldState) => {
                        //    return oldState.imgObjectsExplore.push(
                        //        {
                        //            img: response.primaryImage,
                        //            id: apiURLs[i].id,
                        //            key: i
                        //        }
                        //    )
                        //})
                    } catch (e) {
                        console.log('malformed request:' +e);
                    }
                }
            }
        }
        console.log("state at end of fn:" + this.state.imgObjectsExplore);
        return this.state.imgObjectsExplore;
    }




















}