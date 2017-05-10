import React, {Component} from "react";
import {StyleSheet, View, Alert, TouchableOpacity, Image, TouchableHighlight, Dimensions} from "react-native";
import {Button, ListItem, Left, Right, Body, Thumbnail, Text, Icon} from "native-base";
import styles from "../appStyles";

const logo = require('../../img/default-portrait.png');
const {width, height} = Dimensions.get('window');
export default class Example extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rowID = this.props.index;
        const rowData = this.props.item;
        return (
            <TouchableOpacity onPress={() => this.props.onPress('GridView', rowID, rowData)}>
                <View style={{margin: 0.5}}>
                    <Thumbnail square source={logo} style={styles.gridThumb}/>
                    <Text style={styles.gridText}>ID: {rowID}</Text>
                    <Text style={styles.gridText}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}