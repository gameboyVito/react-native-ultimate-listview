import {StyleSheet, Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    paginationView: {
        flex: 0,
        width: width,
        height: 55,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paginationViewText: {
        fontSize: 16
    },
    paginationViewSpinner: {
        marginRight: 5
    },
    paginationBtn: {
        backgroundColor: 'tomato',
        margin: 10,
        borderRadius: 20,
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationBtnText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    separator: {
        height: 0.5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'lightgray'
    },
    emptyView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    allLoadedText: {
        alignSelf: 'center'
    },
    gridItem: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    }
});