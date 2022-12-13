import React, {Component} from 'react'
import { ListBox, Item, Text, Section } from '@adobe/react-spectrum';
import TextNumbered from '@spectrum-icons/workflow/TextNumbered';
import GearsEdit from '@spectrum-icons/workflow/GearsEdit';
import {Link} from 'react-router-dom';
import '../styles/stylesSheet.css';
import TableAndChart from '@spectrum-icons/workflow/TableAndChart';
import AssetsDownloaded from '@spectrum-icons/workflow/AssetsDownloaded'
class SidebarMenu extends Component {

    render() {
        return(
            <ListBox
            aria-label="Side Navigation"
            defaultSelectedKeys={["1"]} 
            marginTop="size-700">
                <Section title="Manage Data">
                <Item key="1">
                    <Text margin="size-75">
                        <span style={{paddingRight:"10px"}}>
                            <TableAndChart size="S"/>
                        </span>
                        <Link className="link" to="/pqua-data">Extract PQuA Data</Link>
                    </Text>
                </Item>
                {
                <Item key="2">
                    <Text margin="size-75">
                        <span style={{paddingRight:"10px"}}>
                            <AssetsDownloaded size="S" />
                        </span>
                        <Link className="link" to="/download-pods">Download AQB Pods</Link>
                    </Text>
                </Item>
                }
                <Item key="3">
                    <Text margin="size-75">
                        <span style={{paddingRight:"10px"}}>
                            <TextNumbered size="S"/>
                        </span>
                        <Link className="link" to="/bug-data">View Bug Data</Link>
                    </Text>
                </Item>
                </Section>
                <Section title="Manage Products">
                <Item key="4">
                    <Text margin="size-75">
                        <span style={{paddingRight:"10px"}}>
                            <GearsEdit size="S" />
                        </span>
                        <Link className="link" to="/add-update-queries" >Add/Update Product Queries</Link>
                    </Text>
                </Item>
                </Section>
            </ListBox>
        )
    }
}

export default SidebarMenu;
