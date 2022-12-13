import React, {Component} from 'react';
import { Picker, Item} from '@adobe/react-spectrum';

class PickerMenu extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let list = this.props.list;
        let selectionHandler = this.props.selectionHandler;
        return(
                <Picker
                flexGrow="400"
                isDisabled={list.length == 0}
                label={this.props.label}
                    onSelectionChange={(selectedKey) => selectionHandler(selectedKey)}>
                    {
                        list.map(listItem => <Item key={listItem}>{listItem}</Item>)
                    }
                </Picker>
            )
        }
}

export default PickerMenu;