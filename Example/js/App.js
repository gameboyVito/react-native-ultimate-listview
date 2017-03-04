import React, {Component} from "react";
import {StyleSheet, View, Alert, TouchableOpacity, Image, TouchableHighlight} from "react-native";
import {Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon} from "native-base";
import styles from "./styles";
import UltimateListView from "./ultimateListView";


const logo = require('../img/default-portrait.png');
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

            let skip = (page - 1) * 12;
            //let rowData = [];
            let rowData = [
                'Friend ' + (skip),
                'Friend ' + (skip + 1),
                'Friend ' + (skip + 2),
                'Friend ' + (skip + 3),
                'Friend ' + (skip + 4),
                'Friend ' + (skip + 5),
                'Friend ' + (skip + 6),
                'Friend ' + (skip + 7),
                'Friend ' + (skip + 8),
                'Friend ' + (skip + 9),
                'Friend ' + (skip + 10),
                'Friend ' + (skip + 11)
            ];

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
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={logo} style={styles.thumb}/>
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                <Text>RowID: {rowID}</Text>
                <Text note>Data: {rowData}</Text>
                </Body>
                <Right style={{borderBottomWidth: 0}}>
                    <View style={styles.rightBtnGroup}>
                        <Button small transparent title="view" onPress={() => this.onPress('chat', rowID, rowData)}
                                style={styles.rightBtn}>
                            <Icon name="chatbubbles" style={styles.rightBtnIcon}/>
                        </Button>
                        <Button small transparent title="view" onPress={() => this.onPress('like', rowID, rowData)}
                                style={styles.rightBtn}>
                            <Icon name="heart" style={styles.rightBtnIcon}/>
                        </Button>
                        <Button small transparent title="view" onPress={() => this.onPress('share', rowID, rowData)}
                                style={styles.rightBtn}>
                            <Icon name="share" style={styles.rightBtnIcon}/>
                        </Button>
                    </View>
                </Right>
            </ListItem>
        );
    };

    renderGridView = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity onPress={() => this.onPress('GridView', rowID, rowData)}>
                <View>
                    <Thumbnail square source={logo} style={styles.gridThumb}/>
                    <Text style={styles.gridText}>ID: {rowID}</Text>
                    <Text style={styles.gridText}>Data: {rowData}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    onPress = (type, rowID, rowData) => {
        Alert.alert(type, `You're pressing on ${rowData}`);
    };

    render() {
        return (
            <View style={styles.container}>
                <UltimateListView
                    onFetch={this.onFetch}
                    gridView={false}
                    gridColumn={2} // The number of fetching data must be a multiple of grid column
                    separator={true}
                    enableEmptySections={true}
                    headerView={this.renderHeaderView}
                    rowView={this.renderRowView}
                />
            </View>
        );
    }
}
