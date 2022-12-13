import React, { Component } from 'react'
import {RadioGroup, Radio} from '@adobe/react-spectrum'

class PlatformRadioGroup extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let radioValue = this.props.value;
        let selectionHandler = this.props.selectionHandler;

        return(
            <RadioGroup
            label="Platform" 
            orientation="horizontal"
            value={radioValue}
            onChange={(selectedKey) => this.props.selectionHandler(selectedKey)}>
                <Radio value="Desktop">Desktop</Radio>
                <Radio value="Web">Web</Radio>
                <Radio value="Mobile - iOS">Mobile - iOS</Radio>
                <Radio value="Mobile - Android">Mobile - Android</Radio>
            </RadioGroup>
          );
    }
}

export default PlatformRadioGroup;