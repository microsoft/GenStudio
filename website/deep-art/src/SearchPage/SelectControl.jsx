import React, { Component } from 'react';
import styled from "styled-components";

import { Box, Button, Grommet, Select, Text} from 'grommet';
import { grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";

const customRoundedTheme = deepMerge(grommet, {
  global: {
    control: {
      border: {
        radius: "24px"
      }
    },
    input: {
      weight: 400
    },
    font: {
      size: "12px"
    }
  },
  text: {
    medium: "13px"
  },
  textInput: {
    extend: "padding: 0 12px;"
  },
  select: {
    control: {
      extend: "padding: 3px 6px;"
    }
  }
});

const NUM_IMAGES_SEARCH_PAGE = 12;

export default class SearchControl extends Component {
    state = {
        options: ["Vases", "Landscapes", "Portraits", "Men", "Boats",
            "Birds", "Architecture", "Profiles", "Embroidery", "Women", "Flowers",
            "Bridges", "Bodies of Water", "Buildings", "Trees", "Jars"],
        selectedValue: ""
    };

    generateURL(category) {
        let url = "https://met-art-api.azurewebsites.net/GetIDsByCategory";
        url = url + "?category=" + category + "&numids=" + NUM_IMAGES_SEARCH_PAGE +"&resulttype=first";
        return url;
    }

    onSelection(option) {
        this.setState({ value: option })
        const Http = new XMLHttpRequest();
        Http.open("GET", this.generateURL(option));
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4) {
                try {
                    let response = JSON.parse(Http.responseText);
                    let IDs = response.results.ObjectIds;
                    this.props.clearOldImages();
                    this.props.sendObjectIds(IDs);
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }
    }
  
    render() {
        const { options, value } = this.state;
        const defaultOptions = ["Vases", "Landscapes", "Portraits", "Men", "Boats",
            "Birds", "Architecture", "Profiles", "Embroidery", "Women", "Flowers",
            "Bridges", "Bodies of Water", "Buildings", "Trees", "Jars"];
        return (
          <Box align="center" justify="start" pad="small">
            <Select
              focusIndicator="false"
              size="medium"
              placeholder="Categories"
              value={value}
              options={options}
              onChange={({ option }) => this.onSelection(option)}
              onClose={() => this.setState({ options: defaultOptions })}
              onSearch={text => {
                const exp = new RegExp(text, "i");
                this.setState({
                  options: defaultOptions.filter(o => exp.test(o))
                });
              }}
            />
          </Box>
      );
    }
  }