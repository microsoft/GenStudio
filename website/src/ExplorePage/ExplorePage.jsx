import React, { Component } from "react";

import GenArt from "./GenArt.jsx";
import ExplorePalette from "./ExplorePalette.jsx";

import MapExploreContainer from "../MapExploreContainer/MapExploreContainer.jsx";
import {AppInsights} from "applicationinsights-js"


/**
 * Page for the Exploring feature
 * Pulls data from the URL in props.match.params
 */
export default class ExplorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: "",
      apiData: {},
      genImg: 0,
      genSeed: [],
      genLabel: [],
      imgObjectsExplore: []
    };

    this.addSeed = this.addSeed.bind(this);
    this.subSeed = this.subSeed.bind(this);

    AppInsights.downloadAndSetup({ instrumentationKey: "7ca0d69b-9656-4f4f-821a-fb1d81338282" });
    AppInsights.trackPageView("Explore Page");
  }

  /**
   * sets state.imgObjectsExplore to contain a json object for each ID provided. object format: {img, id, key}
   * @param {Int[]} objIDs - an array of art IDs
   */
  objIDsToImages(objIDs) {
    const baseURL =
      "https://mmlsparkdemo.blob.core.windows.net/met/thumbnails/";

    let apiURLs = objIDs.map(ID => ({
      url: baseURL + ID.toString() + ".jpg",
      id: ID
    }));

    for (let i = 0; i < apiURLs.length; i++) {
      this.setState(oldState => {
        oldState.imgObjectsExplore.push({
          img: apiURLs[i].url,
          id: apiURLs[i].id,
          key: i
        })
      });
    }
  }

  componentDidMount() {
    let url = this.props.match.params.id.toString();
    url = decodeURIComponent(url);
    let selectedArt = url.split("&")[0].slice(4);
    let artArr = url.split("&")[1].slice(4);
    artArr = JSON.parse(artArr);
    const id = selectedArt;
    this.objIDsToImages(artArr);

    this.firstTimeGenImage(id);
  }

  /**
   * Sets up component state the first time for the selected image represented by id
   * @param {int} id - object ID of the initial piece of art to generate an image for
   */
  firstTimeGenImage(id) {
    const baseMetUrl =
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
    let metApiUrl = baseMetUrl + id;

    const Http = new XMLHttpRequest();
    Http.open("GET", metApiUrl);
    Http.send();
    Http.onreadystatechange = e => {
      if (Http.readyState === 4) {
        try {
          let response = JSON.parse(Http.responseText);
          this.setState({
            imgData: response.primaryImage,
            apiData: response
          });

          const imageToSeedUrl =
            "https://mmlsparkdemo.blob.core.windows.net/met/inverted/biggan1/seeds/";
          const fileName = response.objectID.toString() + ".json";
          const Http2 = new XMLHttpRequest();
          Http2.open("GET", imageToSeedUrl + fileName);
          Http2.send();
          Http2.onreadystatechange = e => {
            if (Http2.readyState === 4) {
              try {
                let response = JSON.parse(Http2.responseText);
                let seed = [response.latents].toString();
                seed = `[[${seed}]]`;
                let label = response.labels;
                this.setState({
                  genSeed: this.twoDArrayStringToOneDArray(seed),
                  genLabel: response.labels
                });
                this.getGenImage(seed, label);
              } catch {
                console.log("malformed request:" + Http2.responseText);
              }
            }
          };
        } catch (e) {
          console.log("malformed request:" + Http.responseText);
        }
      }
    };
  }

  /**
   * Calls an API, sending a seed, and getting back an ArrayBuffer reprsenting that image
   * This function directly saves the ArrayBuffer to state
   * @param {string} seedArr - string version of a 1xSEED_LENGTH array of floats between -1,1
   */
  getGenImage(seedArr, labelArr) {
    let labels = labelArr.toString();
    labels = `[[${labels}]]`;

    const apiURL =
      "https://gen-studio-apim.azure-api.net/labels?subscription-key=7c02fa70abb8407fa552104e0b460c50";
    const Http = new XMLHttpRequest();
    const data = new FormData();
    data.append("seed", seedArr);
    data.append("labels", labels);

    Http.responseType = "arraybuffer";
    Http.open("POST", apiURL);
    Http.send(data);
    Http.onreadystatechange = e => {
      if (Http.readyState === 4) {
        try {
          let imgData = btoa(
            String.fromCharCode.apply(null, new Uint8Array(Http.response))
          );
          this.setState({ genImg: imgData, genArr: Http.response });
        } catch (e) {
          console.log("malformed request:" + Http.responseText);
        }
      }
    };
  }

  /**
   * Converts a 2D array string into a 1D array of floats
   * @param {string} arrayString - string version of a 1x? array of floats
   * @returns {Float[]} - The 1D float array from arrayString
   */
  twoDArrayStringToOneDArray(arrayString) {
    let numbers = arrayString.substring(2, arrayString.length - 2); //cut off the "[[]]"
    let arrayNum = numbers.split(",").map(function(item) {
      return parseFloat(item);
    });
    return arrayNum;
  }

  /**
   * Finds a difference vector between the genSeed and the otherSeed
   * @param {Float[]} genSeed - the current generated image seed
   * @param {Float[]} otherSeed - the other seed to frind the difference from
   * @param {Float} stepSize - The multiplyer on the difference vector
   */
  findDiff(genSeed, otherSeed, stepSize = 0.1) {
    let diffVec = [];
    for (let i = 0; i < genSeed.length; i++) {
      let diff = (genSeed[i] - otherSeed[i]) * stepSize; //Magic number 10, works well
      diffVec.push(diff);
    }
    return diffVec;
  }

  // findDiff(genSeed, otherSeed, vecMul=1){
  //     let diffVec=[]
  //     for (let i = 0; i < genSeed.length; i++){
  //         let diff = (genSeed[i] - otherSeed[i]);
  //         diffVec.push(diff);
  //     }
  //     let norm = this.normalizeVector(diffVec, vecMul);
  //     return norm;
  // }

  // normalizeVector(vec, multiplyer){
  //     let normVec = [];
  //     for (let i = 0; i < vec.length; i++){
  //         let val = (vec[i] / Math.sqrt(vec[i]*vec[i]))*multiplyer;
  //         normVec.push(val)
  //     }
  //     console.log("Norm"+normVec)
  //     return(normVec);
  // }

  /**
   * Adds diffVec to genSeed, limits values to be between -1,1
   * @param {Float[]} genSeed - The current generated image seed
   * @param {Float[]} diffVec - A difference vector to add to diffVec
   */
  addVec(genSeed, diffVec) {
    let newSeed = [];
    for (let i = 0; i < genSeed.length; i++) {
      let newVal = genSeed[i] - diffVec[i];
      newSeed.push(newVal);
    }
    return newSeed;
  }

  /**
   * Subtracts diffVec from genSeed, limits values to be between -1,1
   * @param {Float[]} genSeed - The current generated image seed
   * @param {Float[]} diffVec - A difference vector to subtract from diffVec
   */
  subVec(genSeed, diffVec) {
    let newSeed = [];
    for (let i = 0; i < genSeed.length; i++) {
      let newVal = genSeed[i] + diffVec[i];
      newSeed.push(newVal);
    }
    return newSeed;
  }

  /**
   * Moves genSeed towards seed linearly, and generates the new image. Directly modifies state.
   * @param {Float[]} seed - 1xSEED_LENGTH array
   */
  addSeed(seed, label) {
    let diffSeed = this.findDiff(this.state.genSeed, seed);
    let newSeed = this.addVec(this.state.genSeed, diffSeed);

    let diffLabel = this.findDiff(this.state.genLabel, label);
    let newLabel = this.addVec(this.state.genLabel, diffLabel);
    this.setState({
      genSeed: newSeed,
      genLabel: newLabel
    });
    let strSeed = `[[${newSeed}]]`;

    this.getGenImage(strSeed, newLabel);
  }

  /**
   * Moves genSeed away from seed linearly, and generates the new image. Directly modifies state.
   * @param {Float[]} seed - 1xSEED_LENGTH array
   */
  subSeed(seed, label) {
    let diffSeed = this.findDiff(this.state.genSeed, seed);
    let newSeed = this.subVec(this.state.genSeed, diffSeed);

    let diffLabel = this.findDiff(this.state.genLabel, label);
    let newLabel = this.addVec(this.state.genLabel, diffLabel);
    this.setState({
      genSeed: newSeed,
      genLabel: newLabel
    });
    let strSeed = `[[${newSeed}]]`;
    this.getGenImage(strSeed, newLabel);
  }

  render() {
    return (
      <MapExploreContainer map={false} location={this.props.location}>
        {t => (
          <>
            <GenArt image={this.state.genImg} data={this.state.genArr} t={t} />
            <div className='explore'>
              <div className='map__plot-header'>{t("map.combine")}</div>
              <ExplorePalette
                images={this.state.imgObjectsExplore}
                addSeed={this.addSeed}
                subSeed={this.subSeed}
              />
            </div>
          </>
        )}
      </MapExploreContainer>
    );
  }
}
