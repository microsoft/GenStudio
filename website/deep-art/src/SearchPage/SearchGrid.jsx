import React, { Component } from 'react';
import ResultBox from './ResultBox.jsx';

import { Grid } from 'grommet';

/**
 * Grid used to display results of a search
 * 'results' prop: an array of the json results from the Azure search (the 'value' value)
 */
export default class SearchGrid extends Component {
    constructor(props){
        super(props);
    };

    render(){
        return(
            <Grid
<<<<<<< HEAD
                columns={"small"}
=======
                columns={"medium"}
>>>>>>> 25e8fcb8f134061cba1e2686674ef6509c759a4a
                rows={"flex"}
                gap="small"
                margin="40px"
            >
                {this.props.results.map(result => (
                    <ResultBox key={result.ObjectID} data={result} />
                ))}
            </Grid>
        );
    }
}