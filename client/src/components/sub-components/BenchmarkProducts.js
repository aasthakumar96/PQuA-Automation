import React, {Component} from 'react';
import { Flex, Text, View, Well, Heading, ListBox, Section, Item } from '@adobe/react-spectrum';

class BenchmarkProducts extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let webProducts = this.props.web;
        let mobileProducts = this.props.mobile;
        let desktopProducts = this.props.desktop;

        return(
            <Well marginTop="size-200">
                <Heading level={4}>Benchmark Products</Heading>
                <Flex direction="row" marginTop="size-100" gap="size-250">
                    <View flexGrow="1">
                        <ListBox selectionMode="none">
                            <Section title="Web Products">
                            {
                                webProducts.map((webProduct) => {
                                    return (
                                        <Item key={webProduct}>
                                            <Text>{webProduct}</Text>
                                        </Item>
                                    )
                                })
                            }
                           </Section>
                        </ListBox>
                    </View>
                    <View flexGrow="1">
                        <ListBox selectionMode="none">
                        <Section title="Mobile Products">
                        {
                                mobileProducts.map((mobileProduct) => {
                                    return (
                                        <Item key={mobileProduct}>
                                            <Text>{mobileProduct}</Text>
                                        </Item>
                                    )
                                })
                        }
                        </Section>
                    </ListBox>
                    </View>
                    <View flexGrow="1">
                        <ListBox selectionMode="none">
                        <Section title="Desktop Products">
                            {
                                desktopProducts.map((desktopProduct) => {
                                    return (
                                        <Item key={desktopProduct}>
                                            <Text>{desktopProduct}</Text>
                                        </Item>
                                    )
                                })
                            }
                        </Section>
                        </ListBox>
                    </View>
                </Flex>
                
            </Well>
        )
    }
}

export default BenchmarkProducts;

/*<View>
                        <ListBox>
                        {
                                mobileProducts.map((mobileProduct) => {
                                    return (
                                        <Item key={mobileProduct}>
                                            <Text>{mobileProduct}</Text>
                                        </Item>
                                    )
                                })
                        }
                        </ListBox>
                    </View>
                    <View>
                        <ListBox>
                            {
                                desktopProducts.map((desktopProduct) => {
                                    return (
                                        <Item key={desktopProduct}>
                                            <Text>{desktopProduct}</Text>
                                        </Item>
                                    )
                                })
                            }
                        </ListBox>
                    </View>*/