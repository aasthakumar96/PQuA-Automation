import React, {Component} from 'react';
import { MenuTrigger, Menu, ActionButton, Item, Flex, View, Text} from '@adobe/react-spectrum';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';

class MultiPickerMenu extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let list = this.props.list;
        let totalSelected = this.props.totalSelected;
        let allSelectedKeys = this.props.allSelectedKeys;
        let eventHandler = this.props.eventHandler;
        return(
                <MenuTrigger closeOnSelect={false} align="end">
                    <ActionButton>
                        {totalSelected}
                        <ChevronDown size="S"/>
                    </ActionButton>
                    <Menu
                        selectionMode="multiple"
                        selectedKeys={allSelectedKeys}
                        onSelectionChange={(selectedKeys) => eventHandler(selectedKeys)}>
                        {
                            list.map(listItem => <Item key={listItem}>{listItem}</Item>)
                        }
                    >
                    </Menu>
                </MenuTrigger>
            )
        }
}

export default MultiPickerMenu;

/*
<Flex direction="row">
                            <View>
                                <Text>{totalSelected}</Text>
                            </View>
                            <View>
                                <ChevronDown size="S"/>
                            </View>
                            </Flex>
*/