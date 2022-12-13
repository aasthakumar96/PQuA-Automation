import React from 'react'
import {Flex, View, Heading, Image } from '@adobe/react-spectrum'
import logo from '../img/logo.png'

export function HeaderBar() {
    return(
        <Flex
                direction="row"
                alignItems="center" >
                <View
                    marginStart="size-130"
                    alignSelf="left"
                    flexGrow="1">
                    <Image
                        src={logo}
                        alt="PQuA Automation logo"
                        width="size-500"
                        height="size-500"
                        objectFit="contain"
                    />
                </View>
                <View
                    flexGrow="70">
                    <span style={{ color: "#F5F5F5" }}>
                        <Heading level={1}>PQuA Automation</Heading>
                    </span>
                </View>
                <View
                    alignSelf="right"
                    flexGrow="1">
                    <span style={{ color: "#F5F5F5" }}>
                        <Heading level={3}>{localStorage.getItem('userName')}</Heading>
                    </span>
                </View>
            </Flex>
    )
}

export default HeaderBar;
