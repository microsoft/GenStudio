import React, { Component } from 'react';
import { Button, Grommet} from 'grommet';
import { Add } from "grommet-icons";

const customTheme = {
    button: {
        extend:{
            "border-radius": "12px",
        }
    }
}

/**
 * Add Icon Button with 'addClick' prop 
 */
export default class AddButton extends Component {

    render(){
        return (
            <Grommet theme={customTheme}>
                <Button icon={<Add />} onClick={() => {this.props.addClick()}} hoverIndicator="#EAEAEA" />
            </Grommet>
        );
    }
}