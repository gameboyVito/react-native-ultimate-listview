import React, {Component} from "react";
import {AppRegistry, StyleSheet, View, Alert, TouchableOpacity, Image} from "react-native";
import {Card, CardItem, Left, Body, Thumbnail, Text} from "native-base";
import styles from "./styles";
import UltimateListView from "./ultimateListView.js";


const logo = require('./img/default-portrait.png');
export default class Example extends Component {

    sleep(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    onFetch = async(page = 1, callback, options) => {
        try {
            //Simulate the network loading
            await this.sleep(2000);

            let skip = (page - 1) * 5;
            //let rowData = [];
            let rowData = ['The Card ' + (skip), 'The Card ' + (skip + 1), 'The Card ' + (skip + 2), 'The Card ' + (skip + 3), 'The Card ' + (skip + 4)];

            //Simulate the end of the list because there is no more data to fetch from the server
            if (page === 5) {
                rowData = [];
            }

            console.log(rowData);
            callback(rowData);

        } catch (err) {
            console.log(err);
        }
    };

    renderHeaderView = () => {
        return (
            <View style={styles.header}>
                <Text style={{textAlign: 'center'}}>I'm the Header View, you can put some instructions or ads
                    here!</Text>
            </View>
        );
    };

    renderRowView = (rowData, sectionID, rowID) => {
        return (
            <Card style={styles.rowAndroid}>
                <CardItem>
                    <Left>
                        <Thumbnail source={logo} style={styles.thumb}/>
                        <Body>
                        <Text style={styles.cardTitle}>Row ID: {rowID}</Text>
                        <Text note style={styles.cardSubTitle}>Row Data: {rowData}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem
                    style={styles.rowBody}
                    cardBody
                    button
                    onPress={() => this.onPress(rowID, rowData)}>
                    <Text>Press on me!</Text>
                    <Text>Or, replace an image here.</Text>
                </CardItem>
            </Card>
        );
    };

    onPress = (rowID, rowData) => {
        Alert.alert(`Row ID: ${rowID}`, `You're pressing on ${rowData}`);
    };

    render() {
        return (
            <View style={[styles.container]}>
                <UltimateListView
                    refreshable
                    autoPagination
                    rowView={this.renderRowView}
                    onFetch={this.onFetch}
                    enableEmptySections={true}
                    headerView={this.renderHeaderView}
                    //renderSeparator={this.renderSeparator}
                    //emptyView={this.renderEmptyView}
                    //paginationFetchingView={this.paginationFetchingView}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('Example', () => Example);
