import React, { Component } from 'react';
import Plot from 'react-plotly.js';

import { Box, Button, Grommet, Select, Text, TextInput} from 'grommet';

export default class SearchControl extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <Plot
                data={[
                    {
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    type: 'scatter',
                    mode: 'lines+points',
                    marker: {color: 'red'},
                    },
                    {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
                ]}
                layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
            />

        );
    }
}