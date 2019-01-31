import React, { Component } from 'react';
import Graph from "react-graph-vis";

// let graph = {
//     nodes: [
//         {id: 1, label: 'Node 1', shape: 'image', image:"https://images.metmuseum.org/CRDImages/es/original/ES6063.jpg"},
//         {id: 2, label: 'Node 2'},
//         {id: 3, label: 'Node 3'},
//         {id: 4, label: 'Node 4'},
//         {id: 5, label: 'Node 5'}
//       ],
//     edges: [
//         {from: 1, to: 2},
//         {from: 1, to: 3},
//         {from: 2, to: 4},
//         {from: 2, to: 5}
//       ]
//   };

let options = {
    edges: {
        color: {
            color: "#000000"
        },
        arrows: {
            to: {
                enabled: true
            },
            from: {
                enabled: false
            }
        },
        length: 500
    },
    width: '100%',
    height: '100%'
};
 
let events = {
    select: function(event) {
        //var { nodes, edges } = event;
    }
}

export default class ImageGraph extends Component {

    constructor(props){
        super(props);
        this.state = {
            graph: {nodes: this.props.nodes, edges: this.props.edges},
            options: {options},
            events: {events}
        };

    };

    render(){
        return(
            <Graph
                graph={{nodes: this.props.nodes, edges: this.props.edges}}
                options={this.state.options.options}
                events={this.state.events.events}
            />

        );
    }
}