import React, { Component } from 'react';

import { Box, Select} from 'grommet';

//const NUM_IMAGES_SEARCH_PAGE = 12;
const NUM_FOR_SELECT = 7;

/**
 * The search bar for art tags
 * 'curatedImages' prop: object of objIDs
 * 'clearOldImages' prop: callback to clear out old images
 * 'snedObjectIds' prop: callback to send the Object IDs to the parent
 */
export default class SearchControl extends Component {
    state = {
        options: ["Armor", "Ewers", "Goblets", "Purses", "Teapots", "Vases"],
        selectedValue: ""
    };

    /**
     * choses N random unique elements from list and returns them in a list
     * @param {any[]} list - list of elements of any type 
     * @param {*} n - the number of unqiue elements to choose. N <= list.length
     */
    pickNUniqueFromList(list, n){
        if (n > list.length){
            return "N IS TOO LARGE";
        }

        let output = [];
        while (output.length < n){
            let randIndex = Math.floor(Math.random()*list.length)
            let choice = list[randIndex];
            if (!output.includes(choice)){
                output.push(choice);
            }
        }
        return output;
    }

    /**
     * Picks images from the category and sends them to the SelectPage for display
     * @param {String} category 
     */
    onSelection(category) {
        this.setState({
            selectedValue: category
        })
        let curatedImages = this.props.curatedImages;
        let IDs = this.pickNUniqueFromList(curatedImages[category], NUM_FOR_SELECT);
        this.props.clearOldImages();
        this.props.sendObjectIds(IDs);
    }
  
    render() {
        const { options, selectedValue } = this.state;
        return (
          <Box align="center" justify="start" pad="small">
            <Select
              focusIndicator={false}
              size="medium"
              placeholder="Select a Category"
              value={selectedValue}
              options={options}
              onChange={({ option }) => this.onSelection(option)}
            />
          </Box>
      );
    }
  }