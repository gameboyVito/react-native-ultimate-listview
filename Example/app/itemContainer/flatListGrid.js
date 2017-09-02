import React, {PureComponent} from "react";
import {StyleSheet, View, Alert, TouchableOpacity, Image, TouchableHighlight, Dimensions} from "react-native";
import {Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon} from "native-base";
import styles from "../styles";

const logo = require('../../img/default-portrait.png');
const {width, height} = Dimensions.get('window');
export default class Example extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const rowID = this.props.index;
        const rowData = this.props.item;
        return (
            <TouchableOpacity onPress={() => this.props.onPress('GridView', rowID, rowData)}>
                <View style={{margin: 0.5, width: width / 3, paddingBottom: 15}}>
                    <Thumbnail square source={logo} style={styles.gridThumb}/>
                    <Text style={styles.gridText}>ID: {rowID}</Text>
                    <Text style={styles.gridText}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}