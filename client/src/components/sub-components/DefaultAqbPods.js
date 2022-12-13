import React, {Component} from 'react';
import { Well,Button, Flex, View, Image } from '@adobe/react-spectrum';
import { Tabs, Item } from '@react-spectrum/tabs';
import BenchmarkProducts from '../sub-components/BenchmarkProducts';
import MixedCharts from '../sub-components/MixedCharts';

class DefaultAqbPods extends Component{
    constructor(props) {
        super(props);
    }

    state = {
        lowerBand: '80',
        upperBand: '87',
        data : 
        [
            ['Product', 'Loc Fixed%', 'English Fixed%', 'Upper band', 'Lower band'],
            ['Sign', 75, 65, 90, 80],
            ['Stock', 82, 77, 90, 80],
            ['AEM', 91, 68, 90, 80],
            ['CC ECOMM', 88, 72, 90, 80],
            ['Connect', 75, 72, 90, 80],
        ],
        options : {
            title: 'Adobe Quality Band : Loc Fixed% : ',
            
            seriesType: 'bars',
            vAxis: { viewWindow: { min: 0, max: 100 } },
            series: { 0: { color: '6A737B'}, 1: { color: 'ABB3B8'}, 2: { type: 'line', color: '#0ba34d' }, 3: { type: 'line', color: '#b80909' } },
            legend: { position: 'bottom' },
            backgroundColor: 'F2F2F2'
        }
    }

    render()
    {
        let platforms = ["Web", "Desktop", "Mobile(iOS)", "Mobile(Android)"];
        return(
            <Well>
                <Tabs aria-label="Default Pods">
                    {
                        platforms.map((platform) =>
                        {
                            return(
                                <Item title={platform} key={platform+"-pods"}>
                                    <Flex direction="row" gap="size-100" marginTop="size-100">
                                        <View>
                                            <MixedCharts lowerBand={this.state.lowerBand} upperBand={this.state.upperBand} data={this.state.data} options={this.state.options}/>
                                        </View>
                                        <View>
                                            <MixedCharts lowerBand={this.state.lowerBand} upperBand={this.state.upperBand} data={this.state.data} options={this.state.options}/>
                                        </View>
                                    </Flex>
                                    <Button marginTop="size-200" variant="cta">Download {platform} pods - Q4'2020</Button>
                                </Item>
                            )
                        })
                    }
                </Tabs>
            </Well>
        )
    }
}

export default DefaultAqbPods;