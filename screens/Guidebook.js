import React from 'react';
import {FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';

export const Guidebook = () => {
    const renderItem = ({item}) => (
        <Item plant = {item} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                data = {PLANTS}
                renderItem = {renderItem}
                keyExtractor = {item => item.id}
                />
            </View>
            <Text>
                Information sourced from the
                <Text style = {{color: 'blue'}}
                    onPress = {() => Linking.openURL('https://www.inhf.org/blog/blog/5-of-iowas-most-invasive-species-and-how-to-get-rid-of-them/')}>
                    Iowa Natural Heritage Foundation
                </Text>
            </Text>
        </SafeAreaView>
        
    );
};

const Item = ({ plant }) => (
    <View style={styles.item}>
        <Image source = {plant.picture} style = {styles.image}></Image>
        <View style = {styles.plantInfo}>
            <Text style = {styles.title}>
                {plant.name}
            </Text>
            <Text>
                <Text style = {styles.subtitle}>Identification: </Text>
                <Text>{plant.description}</Text>
            </Text>
        </View>
    </View>
);

const PLANTS = [
    {
        id: "bushhoneysuckle",
        name: "Bush Honeysuckle",
        description: "Often 6-15 feet tall and found in and on the edges of woodlands. Has egg-shaped leaves, short stalks, red berries, and pink or white flowers.",
        picture: require('../assets/honeysuckle.jpeg')
    },
    {
        id: "European Buckthorn",
        name: "European Buckthorn",
        description: "Up to 22 feet tall, this shrub features grayish/brown bark, yellow-green flowers and clusters of small black fruits.",
        picture: require('../assets/buckthorn.jpeg')
    },
    {
        id: "garlicmustard",
        name: "Garlic Mustard",
        description: "Small, white, four-petaled flowers. Has a distinct garlicky odor when crushed.",
        picture: require('../assets/garlicmustard.jpeg')
    },
    {
        id: "Multiflora Rose",
        name: "Multiflora Rose",
        description: "Thorny shrub with arching stems, fragrant white or pink flowers and bright red rose hip fruits.",
        picture: require('../assets/multiflorarose.jpeg')
    },
    {
        id: "reedcanarygrass",
        name: "Reed Canary Grass",
        description: "Large, coarse grass that can grow to be four feet tall.",
        picture: require('../assets/canarygrass.jpeg')
    }
];

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 100 + '%'
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row'
    },
    plantInfo: {
        flexDirection: 'column',
        flexShrink: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    image: {
        width: 125,
        height: 125,
        borderRadius: 125
    }
});