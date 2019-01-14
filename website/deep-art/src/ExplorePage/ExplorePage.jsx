import React, { Component } from 'react';
import styled from "styled-components";

import GenArt from './GenArt.jsx';
import ExplorePalette from './ExplorePalette.jsx';
import InfoArt from './InfoArt.jsx';

import {Box, Text, Grid, Paragraph} from 'grommet';

const ColumnsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
`

export default class ExplorePage extends Component {
    constructor(props){

        super(props);

        this.state = {
            imgURL: '',
            apiData: {},
            genImg: 0
        };

    };

    componentDidMount () {
        const { id } = this.props.match.params;

        //Eventually replaced with call to GAN
        const baseMetUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
        let metApiUrl = baseMetUrl + id.toString();

        const Http = new XMLHttpRequest();
        Http.open("GET", metApiUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try {
                    let response = JSON.parse(Http.responseText);
                    this.setState({
                        imgURL: response.primaryImage,
                        apiData: response
                    })

                    const imageToSeedUrl = "https://imagetoseed-met.azurewebsites.net/url"
                    const Http2 = new XMLHttpRequest();
                    Http2.open("GET", imageToSeedUrl);
                    let requestBody = new FormData();
                    requestBody.append("url", "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/70-water-lilies-claude-monet.jpg");
                    Http2.send();
                    Http2.onreadystatechange = (e) => {
                        if (Http2.readyState === 4) {
                            try {
                                let response = JSON.parse(Http2.responseText);
                                let seed = [response.response.test.seed].toString();
                                this.getGenImage("[[" + seed + "]]");

                            } catch {
                                console.log('malformed request:' + Http2.responseText);
                            }
                        }
                    }
                } catch (e) {
                    console.log('malformed request:' + Http.responseText);
                }
            }
        }

        //const seedArr = '[[780,1,2,848,6,992,705,667,232,343,522,409,870,458,810,971,187,570,879,724,525,217,183,462,670,90,637,125,50,559,816,176,886,112,185,169,683,753,878,49,628,470,318,836,565,610,452,517,978,985,788,248,540,836,272,32,767,715,253,475,89,670,741,478,913,323,461,276,29,392,355,411,60,884,454,551,811,717,273,926,533,967,834,42,949,766,153,360,238,701,360,710,193,540,370,112,672,363,738,422,215,105,890,906,697,626,9,190,18,744,152,289,87,436,389,306,33,542,673,761,957,863,985,186,611,785,271,698,789,561,968,725,11,66,254,618,611,331,264,532,351,675,24,157,32,381,37,555,661,954,342,353,958,82,18,819,474,372,264,113,723,159,855,596,87,588,777,229,354,29,6,326,637,837,548,48,481,806,927,132,794,186,588,659,116,463,574,125,635,339,202,910,517,994,36,574,392,702,698,734,257,375,795,467,189,78,632,301,349,749,158,930,53,392,148,143,804,877,987,195,411,597,674,798,73,566,183,100,646,814,326,347,255,157,480,91,88,794,948,762,389,538,899,301,593,930,49,620,598,341,345,983,435,671,753,230,132,490,312,80,444,199,380,502,837,21,225,6,576,866,945,871,18,175,999,185,135,628,624,788,73,539,30,577,287,314,844,448,469,644,178,855,915,921,159,124,832,130,680,461,654,188,297,365,45,864,947,504,386,539,757,365,912,276,533,735,427,898,100,750,864,987,576,594,643,629,606,839,471,609,782,179,800,828,306,230,998,546,353,214,110,268,506,555,570,663,886,23,651,464,840,198,617,811,368,603,184,622,779,696,205,320,850,717,119,938,896,314,537,401,635,948,946,355,134,807,827,93,616,984,983,980,10,485,727,94,186,757,326,314,279,751,249,90,437,564,576,553,360,713,165,691,985,318,460,509,553,358,805,157,4,195,460,75,614,29,466,343,218,980,652,698,184,326,671,229,533,237,198,21,738,544,559,294,881,25,25,139,255,205,277,280,749,174,659,543,181,856,260,76,787,328,148,655,707,119,430,226,839,140,468,298,956,928,50,323,992,314,773,135,968,204,834,35,742,20,966,14,484,944,780,276,707,411,870,327,829,873,298,610,687,938,85,3,583,190,187,412,620,277,674,238,862,793,928,547,341,957,491,670,234,596]]';
        //this.getGenImage(seedArr);
    }

    getGenImage(seedArr){
        const apiURL = 'http://artgan.eastus2.cloudapp.azure.com:8080/seed2image';
        const Http = new XMLHttpRequest();
        const data = new FormData();
        data.append('seed', seedArr);

        Http.responseType = "arraybuffer"
        Http.open("POST", apiURL);
        Http.send(data);
        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4){
                try{
                    let imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(Http.response)));
                    this.setState({genImg: imgData});

                } catch (e) {
                    console.log('malformed request:'+Http.responseText);
                }
            }
        }

    }

    render(){
        return(
            <Grid
                areas={[
                    { name: 'left', start: [0, 0], end: [0, 1] },
                    { name: 'info', start: [1, 0], end: [1, 0] },
                    { name: 'explore', start: [1, 1], end: [1, 1] },
                    { name: 'right', start: [2, 0], end: [2, 1] },
                ]}
                columns={['flex','xlarge','flex']}
                rows={['medium','large']}
                gap='small'
            >
                <Box gridArea='info' direction='row' justify="center">
                    <Box direction='column' justify="center" pad="medium">
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"large"}>
                        {this.state.apiData.title}
                        </Paragraph>
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"large"}>
                        {this.state.apiData.objectDate}
                        </Paragraph>
                        <Paragraph style={{textAlign: 'center'}} alignSelf={"center"} size={"large"}>
                        Artist: {this.state.apiData.artistDisplayName}
                        </Paragraph>
                    </Box>
                    <InfoArt image={this.state.imgURL}/>
                </Box>
                <Box gridArea='explore' direction='row' align='center' justify="center">
                        <GenArt image={this.state.genImg}/>
                    
                    <Box>
                        <ExplorePalette/>
                    </Box>
                    
                </Box>
            </Grid>
        );
    }
}