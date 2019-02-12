import React, { Component } from "react";
import { Box, Grid, Paragraph } from "grommet";
import InfoArt from "../ExplorePage/InfoArt.jsx";

const ArtworkInfo = ({ apiData, imgData }) => {
  return (
    <Box gridArea='info' direction='row' justify='center' align='center'>
      <Box direction='column' justify='center' pad='medium'>
        <Paragraph
          style={{ textAlign: "center" }}
          alignSelf={"center"}
          size={"medium"}
        >
          {apiData.title}
        </Paragraph>
        <Paragraph
          style={{ textAlign: "center" }}
          alignSelf={"center"}
          size={"medium"}
        >
          {apiData.objectDate}
        </Paragraph>
        <Paragraph
          style={{ textAlign: "center" }}
          alignSelf={"center"}
          size={"medium"}
        >
          Artist: {apiData.artistDisplayName}
        </Paragraph>
      </Box>
      <InfoArt image={imgData} />
    </Box>
  );
};

export default ArtworkInfo;
