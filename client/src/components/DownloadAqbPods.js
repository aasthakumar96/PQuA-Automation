import React, {Component} from 'react';
import { withCookies } from 'react-cookie';
import { Well, Heading, View } from '@adobe/react-spectrum';
import { Tabs, Item } from '@react-spectrum/tabs';
import DefaultAqbPods from './sub-components/DefaultAqbPods';
import CustomAqbPods from './sub-components/CustomAqbPods';
import BenchmarkProducts from './sub-components/BenchmarkProducts';

class DownloadAqbPods extends Component{
    constructor(props) {
        super(props);
    }

    state = {
        web : ["Stock", "Admin Console", "CC ECOMM", "AEM", "Target", "Sign" ],
        desktop : ["Adobe XD", "Illustrator", "Acrobat", "Premiere Pro", "Photoshop", "Dreamweaver"],
        mobile : ["Fresco", "Capture", "XD Mobile", "Acrobat Reader", "Lightroom Mobile" ]
    }

    render(){
        let productList = this.props.productList;

        return (
        <Well  margin="size-800">
            <View marginX="size-1000" marginY="size-200">
                <Heading level={2}>Download AQB Pods</Heading>
                <Tabs aria-label="Download AQB Pods" orientation="horizontal">
                    <Item title="Custom Pods" key="custom-pods">
                        <CustomAqbPods productList={productList} index="0"/>
                        <BenchmarkProducts web={this.state.web} desktop={this.state.desktop} mobile={this.state.mobile}/>
                        
                    </Item>
                    <Item title="Default Pods" key="default-pods">
                        <DefaultAqbPods/>
                        <BenchmarkProducts web={this.state.web} desktop={this.state.desktop} mobile={this.state.mobile}/>
                        
                    </Item>
                </Tabs>
            </View>
        </Well>
        )
    }
}

export default withCookies(DownloadAqbPods);