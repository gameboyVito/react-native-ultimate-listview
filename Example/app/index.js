import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Dimensions,
    SegmentedControlIOS
} from "react-native";
import {Item, Input, Header, Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon} from "native-base";
import styles from "./appStyles";
import LoadingSpinner from "./loadingSpinner";
import FlatListItem from "./flatList/flatListItem";
import FlatListGrid from "./flatList/flatListGrid";
import ListViewItem from "./listView/ListViewItem";
import ListViewGrid from "./listView/ListViewGrid";
//import UltimateListView from "react-native-ultimate-listview";
import UltimateListView from "../src/ultimateListView";
//import UltimateListView from "../src/copy";

const logo = require('../img/default-portrait.png');
const {width, height} = Dimensions.get('window');
export default class Example extends Component {

    constructor(props) {
        super(props);
        this.state = {
            layout: 'list'
        }
    }

    sleep = (time) => {
        return new Promise(resolve => {
            setTimeout(() => resolve(), time);
        })
    };

    onFetch = async(page = 1, startFetch, abortFetch) => {
        try {
            //This is required to determinate whether the first loading list is all loaded.
            const pageLimit = 24;
            let skip = (page - 1) * pageLimit;

            //Generate dummy data
            let rowData = Array.from({length: pageLimit}, (value, index) => `item -> ${index + skip}`);

            //Simulate the end of the list if there is no more data returned from the server
            if (page === 10) {
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

    onChangeLayout = (event) => {
        switch (event.nativeEvent.selectedSegmentIndex) {
            case 0:
                this.setState({layout: 'list'});
                break;
            case 1:
                this.setState({layout: 'grid'});
                break;
            default:
                break;
        }
    };

    renderHeaderView = () => {
        return (
            <View>
                <View style={styles.header}>
                    <Text style={{textAlign: 'center'}}>I'm the Header View, you can put some Instructions or Ads Banner
                        here!</Text>
                </View>
                <View style={styles.headerSegment}>
                    <Left style={{flex: 0.15}}/>
                    <SegmentedControlIOS
                        style={{flex: 0.7}}
                        values={['list', 'grid']}
                        tintColor='#57a8f5'
                        selectedIndex={this.state.layout === 'list' ? 0 : 1}
                        onChange={this.onChangeLayout}
                    />
                    <Right style={{flex: 0.15}} />
                </View>
            </View>
        );
    };

    //Only use this to render a FlatList, make sure your component extends to PureComponent instead of Component
    renderItem = (item, index) => {
        if (this.state.layout === 'list') {
            return (
                <FlatListItem item={item} index={index} onPress={this.onPressFlatItem}/>
            );
        } else if (this.state.layout === 'grid') {
            return (
                <FlatListGrid item={item} index={index} onPress={this.onPressFlatItem}/>
            );
        }
    };

    onPressFlatItem = (type, index, item) => {
        Alert.alert(type, `You're pressing on ${item}`);
    };

    //Only use this to render a ListView in List mode, make sure to set legacyImplementation={true}
    renderRowView = (rowData, sectionID, rowID) => {
        if (this.state.layout === 'list') {
            return (
                <ListViewItem item={rowData} index={rowID} onPress={this.onPressListItem}/>
            );
        } else if (this.state.layout === 'grid') {
            return (
                <ListViewGrid item={rowData} index={rowID} onPress={this.onPressListItem}/>
            );
        }
    };

    onPressListItem = (type, rowID, rowData) => {
        Alert.alert(type, `You're pressing on ${rowData}`);
    };

    renderPaginationFetchingView = () => {
        return (
            <LoadingSpinner height={height * 0.2} text="loading"/>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                    </Item>
                    <Button transparent title="search" onPress={() => null}>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <UltimateListView
                    key={this.state.layout} //this is important to distinguish different FlatList
                    onFetch={this.onFetch}
                    headerView={this.renderHeaderView}
                    keyExtractor={(item, index) => `${this.state.layout} - ${item}`}
                    refreshableMode="advanced" //basic or advanced

                    //-------FlatList--------
                    //rowView={this.renderItem}
                    //gridColumn={this.state.layout === 'list' ? 1 : 3} //to use grid layout, simply set gridColumn > 1
                    //rowContainerStyle={{height: 120}}  //use this line to customise style of each row in FlatList, only work when gridColumn > 1
                    //-----------------------


                    //----Legacy ListView----
                    legacyImplementation //uncomment it to use the old fashion ListView (poor performance)
                    rowView={this.renderRowView}
                    gridColumn={this.state.layout === 'list' ? 1 : 3} //to use grid layout, simply set gridColumn > 1
                    cellContainerStyle={{width: width / 3, height: width / 3}}  //use this line to customise style of each cell
                    //-----------------------


                    //----Extra Config----
                    paginationFetchingView={this.renderPaginationFetchingView}
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
