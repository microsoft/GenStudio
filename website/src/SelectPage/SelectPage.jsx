import React, { Component } from 'react';
import SelectControl from './SelectControl.jsx';
import ResultArt from './ResultArt.jsx';
import { NamespacesConsumer } from 'react-i18next';
import {AppInsights} from "applicationinsights-js"


const NUM_FROM_EACH_CAT = 2; //Number to choose from each category
const NUM_MAX_RESULTS = 6;

/**
 * Page for selecting an image to start generating on
 */
class SelectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curatedImages: {
        Vases: [
          9583,
          9512,
          9408,
          9405,
          9402,
          9397,
          9393,
          2556,
          9396,
          9232,
          9233,
          9249,
          9363,
          9260,
          9252,
          9297,
          9250,
          9299,
        ],
        Armor: [22270, 22408, 22848, 23143, 25114, 34652, 35652, 24937],
        Teapots: [
          8348,
          8354,
          8355,
          8375,
          8385,
          8391,
          8396,
          8401,
          8412,
          8423,
          42323,
          193189,
          194634,
          197523,
          198032,
        ],
        Ewers: [
          201671,
          202194,
          232038,
          324830,
          324917,
          544501,
          751402,
          446900,
          445269,
          200171,
          200117,
          195775,
          194243,
          49208,
          42370,
          447077,
          448260,
          449058,
          460715,
          453457,
          453306,
          452036,
          447072,
          444967,
          444810,
        ],
        Purses: [84595, 116964, 116963, 116944, 116884, 79226, 70467],
        Goblets: [207897, 4081, 4086, 4101, 4102, 4124, 187987, 239826],
      },
      choiceLists: { 0: [], 1: [] }, //I really do not like this, hard coded so theres something to reference
      selectedIndex: 0,
      selectedImage: {
        id: 0,
        key: -1,
      },
      imgObjects: [],
      categorySelected: false,
    };

    this.changeSelectedImage = this.changeSelectedImage.bind(this);
    this.getImageIDs = this.getImageIDs.bind(this);
    this.clearOldImages = this.clearOldImages.bind(this);

    AppInsights.downloadAndSetup({ instrumentationKey: "7ca0d69b-9656-4f4f-821a-fb1d81338282" });
    AppInsights.trackPageView("Select Page");
  }

  /**
   * choses N random unique elements from list and returns them in a list
   * @param {any[]} list - list of elements of any type
   * @param {*} n - the number of unqiue elements to choose. N <= list.length
   */
  pickNUniqueFromList(list, n) {
    if (n > list.length) {
      return 'N IS TOO LARGE';
    }

    let output = [];
    while (output.length < n) {
      let randIndex = Math.floor(Math.random() * list.length);
      let choice = list[randIndex];
      if (!output.includes(choice)) {
        output.push(choice);
      }
    }
    return output;
  }

  /**
   * Gets the list of object ids to be used on the landing page
   * While doing so, also populates choiceLists with subset lists, each list contianing one ObjID from each category
   * @returns {int[]} - list of object IDs to be displayed
   */
  getLandingPage() {
    let categories = Object.keys(this.state.curatedImages);
    let landingPageList = [];

    let choiceLists = {};
    for (let j = 0; j < NUM_FROM_EACH_CAT; j++) {
      choiceLists[j] = [];
    }

    for (let i = 0; i < categories.length; i++) {
      let list = this.state.curatedImages[categories[i]];
      let choices = this.pickNUniqueFromList(list, NUM_FROM_EACH_CAT);
      landingPageList = landingPageList.concat(choices);

      for (let j = 0; j < NUM_FROM_EACH_CAT; j++) {
        choiceLists[j].push(choices[j]);
      }
    }

    this.setState({
      choiceLists: choiceLists,
      curatedImages: Object.assign({}, this.state.curatedImages, { All: landingPageList })
    });

    return landingPageList;
  }

  //these are the initial images that are displayed when the page loads
  componentDidMount() {
    let landingPageList = this.getLandingPage();
    this.objIDsToImages(landingPageList);
  }

  /**
   * Changes the selection of an ID in state
   * @param {int} key
   * @param {int} ID - objID of the art being selected
   */
  changeSelectedImage(key, ID) {
    //Unclear if this is a better system or not
    if (ID === this.state.selectedImage.id) {
      this.setState({
        selectedImage: {
          id: 0,
          key: -1,
        },
      });
    } else {
      this.setState({
        selectedImage: {
          id: ID,
          key: key,
        },
      });
    }
  }

  /**
   * callback wrapper for the objIDsToImages function
   * @param {int[]} imageIDs - list of object IDs to get the images for
   */
  getImageIDs(imageIDs) {
    this.objIDsToImages(imageIDs);
  }

  /**
   * Clears the state of objects and the selected category
   */
  clearOldImages() {
    this.setState({
      categorySelected: true,
      imgObjects: [],
    });
  }

  /**
   * loads the images of the specified object IDs from the Met and saves it
   * into this.state.imgObjects
   * @param {Int[]} objIDs - An array of object IDs from the met API to convert to an array of image urls
   */
  objIDsToImages(objIDs) {
    const baseURL = 'https://deepartstorage.blob.core.windows.net/public/thumbnails4/';

    let imgObjs = objIDs.map(ID => ({ img: baseURL + ID.toString() + '.jpg', id: ID, key: ID }));

    this.setState({
      imgObjects: imgObjs,
    });
  }

  /**
   * Generates a URL suffix to transmit objID's between pages of the website
   * @returns {String} - the URL suffix encoding ObjIDs
   */
  generateArtUrlSuffix() {
    let urlBase = '/map/';
    let idList = [];

    //If a category is selected, then just use the current set of images
    if (this.state.categorySelected) {
      idList = this.state.imgObjects.slice(0, NUM_MAX_RESULTS).map(ob => ob.id);

      //Else, you are in the default landing page and should take the selected image and a choiceList that does not contain the selected image
    } else {
      if (!this.state.choiceLists[0].includes(this.state.selectedImage.id)) {
        idList = [this.state.selectedImage.id].concat(this.state.choiceLists[0]);
      } else {
        idList = [this.state.selectedImage.id].concat(this.state.choiceLists[1]);
      }
      idList = idList.slice(0,NUM_MAX_RESULTS);
    }
    
    // Randomly selects an image if no image is selected from the array of imgObjects and category not selected
    if(this.state.selectedImage.id === 0 && !this.state.categorySelected){
      let imgSet = this.state.imgObjects.slice(0, NUM_MAX_RESULTS).map(ob => ob.id);
      let randomId;

      for(var i = 0 ; i < imgSet.length ; i++){
        let count = 0;
        for(var x = 0 ; x < idList.length ; x++){
          count++;
          if(imgSet[i] === idList[x]){
            break;
          }
        }
        if(count === 6){
          randomId = imgSet[i]

          idList[0] = randomId;
          let url = '?id=' + randomId.toString() + '&ids=[' + idList.toString() + ']';
          url = encodeURIComponent(url);
          return urlBase + url;
        }
      }
    } else {
      let url = '?id=' + this.state.selectedImage.id.toString() + '&ids=[' + idList.toString() + ']';
      url = encodeURIComponent(url);
      return urlBase + url;
    }
  }

  render() {
    return (
      <NamespacesConsumer>
        {t => (
          <React.Fragment>
            <div className="selectpage__head">
              <h1 className="claim">{t('global.claim')}</h1>
              <SelectControl
                sendObjectIds={this.getImageIDs}
                clearOldImages={this.clearOldImages}
                curatedImages={this.state.curatedImages}
              />
            </div>
            <ResultArt
              images={this.state.imgObjects}
              selectedImage={this.state.selectedImage}
              selectImage={this.changeSelectedImage}
              categorySelected={this.state.categorySelected}
            />
            <div className="u-container-centered">
              <a className="button" href={this.generateArtUrlSuffix()}>Generate</a>
            </div>
          </React.Fragment>
        )}
      </NamespacesConsumer>
    );
  }
}

export default SelectPage;
