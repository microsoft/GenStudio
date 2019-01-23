import React, { Component } from 'react';

import { Box, Grid, Text} from 'grommet';
import SearchControl from './SearchControl.jsx';
import TagList from './TagList.jsx';
import SearchGrid from './SearchGrid.jsx';

export default class GraphPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: "",
            tags: ["a","b","c"],
            tagData: {"a": false, "b": false, "c": false}
        };
        this.getChange = this.getChange.bind(this);
        this.getTagChange = this.getTagChange.bind(this);
    };

    getChange(newSearchValue){
        this.setState({searchValue: newSearchValue});
    }

    getTagChange(label, value){
        this.setState((oldState) => {
            return oldState.tagData[label] = value;
        });
    }

    render(){
        return(
            <Grid
            fill
            areas={[
                { name: 'search', start: [0, 0], end: [0, 0] },
                { name: 'tags', start: [0, 1], end: [0, 1] },
                { name: 'display', start: [1, 0], end: [1, 1] },
                { name: 'right', start: [2, 0], end: [2, 1] },
            ]}
            columns={['medium','flex','small']}
            rows={['small','flex']}
            gap='small'
            >
    
                <Box gridArea='search' background="brand" >
                    <SearchControl sendChange={this.getChange}/>
                </Box>
                <Box gridArea='tags' >
                    <TagList tags={this.state.tags} tagData={this.state.tagData} tagChange={this.getTagChange}/>
                </Box>
                <Box gridArea='display' background="accent-1">
                    <Box height="99%">
                    {/* Takes prop 'results' */}
                        <SearchGrid results = {[
{
"@search.score": 1.4663118,
"ObjectID": "358948",
"Department": "Drawings and Prints",
"Title": "Two Boys with aa Puppy",
"Culture": "''",
"Medium": "Black chalk and graphite on parchment",
"Classification": "Drawings",
"LinkResource": "http://www.metmuseum.org/art/collection/search/358948",
"PrimaryImageUrl": "https://images.metmuseum.org/CRDImages/dp/original/DP801044.jpg",
"Neighbors": [
"358048",
"396036",
"371666",
"341944",
"371024",
"342596",
"336899",
"342328",
"334717",
"338829"
]
},
{
"@search.score": 1.465969,
"ObjectID": "358048",
"Department": "Drawings and Prints",
"Title": "Two Boys with a Puppy",
"Culture": "''",
"Medium": "Black chalk and graphite on parchment",
"Classification": "Drawings",
"LinkResource": "http://www.metmuseum.org/art/collection/search/358048",
"PrimaryImageUrl": "https://images.metmuseum.org/CRDImages/dp/original/DP801043.jpg",
"Neighbors": [
"358948",
"396036",
"341273",
"341944",
"408098",
"348360",
"336544",
"334695",
"348161",
"372760"
]
},
{
"@search.score": 1.2588559,
"ObjectID": "362301",
"Department": "Drawings and Prints",
"Title": "Child Carrying a Puppy on his Shoulder",
"Culture": "''",
"Medium": "Etching retouched with gray wash; artist's proof",
"Classification": "Prints",
"LinkResource": "http://www.metmuseum.org/art/collection/search/362301",
"PrimaryImageUrl": "https://images.metmuseum.org/CRDImages/dp/original/DP817550.jpg",
"Neighbors": [
"410794",
"383904",
"338746",
"395495",
"338897",
"340891",
"338172",
"342150",
"339910",
"340272"
]
},
{
"@search.score": 1.258345,
"ObjectID": "362302",
"Department": "Drawings and Prints",
"Title": "Child Carrying a Puppy on his Shoulder",
"Culture": "''",
"Medium": "Etching; first state, with printed tone",
"Classification": null,
"LinkResource": null,
"PrimaryImageUrl": null,
"Neighbors": []
},
{
"@search.score": 0.8385548,
"ObjectID": "671000",
"Department": "Asian Art",
"Title": "長澤蘆雪筆　天明美人図|Two Women and a Puppy",
"Culture": "Japan",
"Medium": "Hanging scroll; ink and color on silk",
"Classification": null,
"LinkResource": null,
"PrimaryImageUrl": null,
"Neighbors": []
},
{"ObjectID": "712741",
"Department": "The Cloisters",
"Title": "Door knocker in the shape of a small dog or puppy",
"Culture": "Spanish",
"Medium": "Wrought iron",
"Classification": null,
"LinkResource": null,
"PrimaryImageUrl": null,
"Neighbors": []
}
]}/> 
                    </Box>
                    
                </Box>

                <Box gridArea='right' />
    
            </Grid>
        );


    };

}