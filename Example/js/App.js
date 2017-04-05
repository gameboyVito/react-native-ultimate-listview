import React, {Component} from "react";
import {StyleSheet, View, Alert, TouchableOpacity, Image, TouchableHighlight} from "react-native";
import {Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon} from "native-base";
import styles from "./appStyles";
import UltimateListView from "react-native-ultimate-listview";
//import UltimateListView from "../src/ultimateListView";
//import UltimateListView from "../src/copy";

const logo = require('../img/default-portrait.png');
export default class Example extends Component {

    sleep = (time) => {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    onFetch = async(page = 1, startFetch, abortFetch) => {
        try {
            //This is required to determinate whether the first loading list is all loaded.
            const pageLimit = 24;
            let skip = (page - 1) * pageLimit;

            //Generate dummy data
            let rowData = Array.from({length: pageLimit}, (value, index) => index + skip);

            //Simulate the end of the list if there is no more data returned from the server
            if (page === 3) {
                rowData = [];
            }

            //Simulate the network loading in ES7 syntax (async/await)
            await this.sleep(2000);
            startFetch(rowData, pageLimit);
        } catch (err) {
            abortFetch(); //manually stop the refresh or pagination if it encounters network error
            console.log(err);
        }
    };

    renderHeaderView = () => {
        return (
            <View style={styles.header}>
                <Text style={{textAlign: 'center'}}>I'm the Header View, you can put some Instructions or Ads
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
                <Text note>Data: Friend {rowData}</Text>
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
                    ref={(ref) => this._listView = ref}
                    onFetch={this.onFetch}
                    enableEmptySections
                    headerView={this.renderHeaderView}

                    //----Normal Mode----
                    separator={true}
                    rowView={this.renderRowView}

                    //refreshable={false}
                    refreshableMode="advanced" //basic | advanced
                    refreshableTitlePull="Pull To Refresh"

                    //----GridView Mode----
                    //gridView={true}
                    //gridBorder={true}
                    //gridColumn={3}
                    //pageSize={3}
                    //rowView={this.renderGridView}

                    //----Extra Config----
                    //paginationFetchingView={this.paginationFetchingView}
                    //sectionHeaderView={this.renderSectionHeaderView}
                    //paginationFetchingView={this.renderPaginationFetchingView}
                    //paginationAllLoadedView={this.renderPaginationAllLoadedView}
                    //paginationWaitingView={this.renderPaginationWaitingView}
                    //emptyView={this.renderEmptyView}
                    //separator={this.renderSeparatorView}
                />
            </View>
        );
    }
}
