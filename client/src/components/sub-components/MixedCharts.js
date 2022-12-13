import React, {Component} from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import Chart from 'react-google-charts';

class MixedCharts extends Component{
    constructor(props) {
        super(props);
    }

    render()
    {
        let data = this.props.data;
        let chartTitle = this.props.title;
        let lowerBandRGB = this.props.lowerBandColor;
        let upperBandRGB = this.props.upperBandColor;
        return (
            <Chart
            width={'500px'}
            height={'250px'}
            loader={<div>Loading Chart</div>}
            chartType="ComboChart"
            data={data}
            options={{
                title: chartTitle,
                seriesType: 'bars',
                vAxis: { format: 'decimal', minValue: 0, maxValue: 100 },
                series: { 0: { color: '6A737B'}, 1: { color: 'ABB3B8'}, 2: { type: 'line', color: lowerBandRGB}, 3: { type: 'line', color: upperBandRGB } },
                legend: { position: 'bottom' },
                backgroundColor: 'F2F2F2'
            }}
            rootProps={{ 'data-testid': '1' }}
            />
        )
    }
}

export default MixedCharts;