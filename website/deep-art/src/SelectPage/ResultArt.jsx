import React, { Component } from "react";
import { Box, Button, Image, Grid } from "grommet";
import styled from "styled-components";

const GridWrapper = styled(Box)`
  flex-grow: 1;
  direction: row;
  align-items: center;
`;

/**
 * The grid of thumbnails of art
 *  images : List of ObjIDs to be displayed
 *  selectedImage : the currently selected image
 *  selectImage : callback to change the selected image
 *  categorySelected : the selected category
 */
export default class ResultArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedID: 0
    };
  }

  render() {
    let imagesToDisplay = this.props.images;
    if (this.props.categorySelected) {
      imagesToDisplay = imagesToDisplay.slice(0, 6);
    }
    return (
      <GridWrapper>
        <Grid
          columns={["small", "small", "small", "small", "small", "small"]}
          rows={"meduim"}
          gap='medium'
          margin='40px'
        >
          {imagesToDisplay.map((image, i) => (
            <Button
              hoverIndicator
              style={{ outline: "none" }}
              key={i}
              onClick={() => {
                this.props.selectImage(image.key, image.id);
              }}
            >
              <Box
                border={
                  this.props.selectedImage.key === image.key
                    ? { color: "#000000", size: "2px" }
                    : { color: "white", size: "2px" }
                }
                height='small'
                width='small'
                key={i}
                style={{ focus: { outline: 0 } }}
              >
                <Image
                  src={image.img}
                  fit='cover'
                  style={{ height: "100%", zIndex: "-1" }}
                />
              </Box>
            </Button>
          ))}
        </Grid>
      </GridWrapper>
    );
  }
}
