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

export default class SearchControl extends Component {
    state = {
      options: ["Vase","Landscape","Portrait"],
      value: ""
    };
  
    render() {
      const { options, value } = this.state;
      const defaultOptions = ["Vase","Landscape","Portrait"];
      return (
        // <Grommet full theme={customRoundedTheme}>
          <Box align="center" justify="start" pad="small">
            <Select
              size="medium"
              placeholder="Tags"
              value={value}
              options={options}
              onChange={({ option }) => this.setState({ value: option })}
              onClose={() => this.setState({ options: defaultOptions })}
              onSearch={text => {
                const exp = new RegExp(text, "i");
                this.setState({
                  options: defaultOptions.filter(o => exp.test(o))
                });
              }}
            />
          </Box>
        //</Grommet>
      );
    }
  }