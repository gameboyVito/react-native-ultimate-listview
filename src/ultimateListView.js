import React, {Component} from "react";
import {
    ListView,
    Platform,
    TouchableOpacity,
    View,
    Text,
    Alert,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from "react-native";
import {mergeRecursive} from "./util";
import RefreshableScrollView from "./refreshableScrollView";
const {width, height} = Dimensions.get('window');
const PaginationStatus = {
    firstLoad: 0,
    waiting: 1,
    allLoaded: 2
};

export default class UltimateListView extends Component {

    static defaultProps = {
        initialListSize: 10,
        firstLoader: true,
        scrollEnabled: true,
        withSections: false,
        rowHasChanged: null,
        distinctRows: null,
        onFetch: null,

        //Custom View
        headerView: null,
        rowView: null,
        sectionHeaderView: null,
        paginationFetchingView: null,
        paginationAllLoadedView: null,
        paginationWaitingView: null,
        emptyView: null,
        separator: null,

        //Refreshable
        refreshable: true,
        refreshableMode: 'basic', //basic or advanced

        //RefreshControl
        refreshableColors: ['dimgray', 'tomato', 'limegreen'],
        refreshableProgressBackgroundColor: 'white',
        refreshableSize: undefined,
        refreshableTintColor: 'lightgray',
        renderRefreshControl: null,

        //Advanced RefreshView
        refreshableTitlePull: 'Pull To Refresh',
        refreshableTitleRefreshing: 'Refreshing...',
        refreshableTitleRelease: 'Release To Refresh',
        customRefreshView: null,
        customRefreshViewHeight: -1,
        displayDate: true,
        dateFormat: 'yyyy-MM-dd hh:mm',
        dateTitle: 'Last updated time: ',
        arrowImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQBAMAAAD8TNiNAAAAJ1BMVEUAAACqqqplZWVnZ2doaGhqampoaGhpaWlnZ2dmZmZlZWVmZmZnZ2duD78kAAAADHRSTlMAA6CYqZOlnI+Kg/B86E+1AAAAhklEQVQ4y+2LvQ3CQAxGLSHEBSg8AAX0jECTnhFosgcjZKr8StE3VHz5EkeRMkF0rzk/P58k9rgOW78j+TE99OoeKpEbCvcPVDJ0OvsJ9bQs6Jxs26h5HCrlr9w8vi8zHphfmI0fcvO/ZXJG8wDzcvDFO2Y/AJj9ADE7gXmlxFMIyVpJ7DECzC9J2EC2ECAAAAAASUVORK5CYII=',

        //Pagination
        autoPagination: true,
        onEndReachedThreshold: 50,
        allLoadedText: 'End of the list',

        //Spinner
        spinnerColor: 'gray',
        fetchingSpinnerSize: 'large',
        waitingSpinnerSize: 'small',
        waitingSpinnerText: 'Loading...',

        //Pagination Button
        paginationBtnText: 'Load more...',

        //GridView
        gridView: false,
        gridColumn: 2,
        gridBorder: true,
        pageSize: 10,
        cellWidth: undefined,
        cellHeight: undefined
    };

    static propTypes = {
        initialListSize: React.PropTypes.number,
        firstLoader: React.PropTypes.bool,
        scrollEnabled: React.PropTypes.bool,
        withSections: React.PropTypes.bool,
        onFetch: React.PropTypes.func,
        rowHasChanged: React.PropTypes.func,
        distinctRows: React.PropTypes.func,

        //Custom ListView
        headerView: React.PropTypes.func,
        rowView: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        paginationFetchingView: React.PropTypes.func,
        paginationAllLoadedView: React.PropTypes.func,
        paginationWaitingView: React.PropTypes.func,
        emptyView: React.PropTypes.func,
        separator: React.PropTypes.any,

        //Refreshable
        refreshable: React.PropTypes.bool,
        refreshableMode: React.PropTypes.string,

        //RefreshControl
        refreshableColors: React.PropTypes.array,
        refreshableProgressBackgroundColor: React.PropTypes.string,
        refreshableSize: React.PropTypes.string,
        refreshableTintColor: React.PropTypes.string,
        renderRefreshControl: React.PropTypes.func,

        //Advanced RefreshView
        refreshableTitlePull: React.PropTypes.string,
        refreshableTitleRefreshing: React.PropTypes.string,
        refreshableTitleRelease: React.PropTypes.string,
        customRefreshView: React.PropTypes.func,
        customRefreshViewHeight: React.PropTypes.number,
        displayDate: React.PropTypes.bool,
        dateFormat: React.PropTypes.string,
        dateTitle: React.PropTypes.string,
        arrowImage: React.PropTypes.string,

        //Pagination
        autoPagination: React.PropTypes.bool,
        onEndReachedThreshold: React.PropTypes.number,
        allLoadedText: React.PropTypes.string,

        //Spinner
        spinnerColor: React.PropTypes.string,
        fetchingSpinnerSize: React.PropTypes.any,
        waitingSpinnerSize: React.PropTypes.any,
        waitingSpinnerText: React.PropTypes.string,

        //Pagination Button
        paginationBtnText: React.PropTypes.string,

        //GridView
        gridView: React.PropTypes.bool,
        gridColumn: React.PropTypes.number,
        gridBorder: React.PropTypes.bool,
        pageSize: React.PropTypes.number,
        cellWidth: React.PropTypes.number,
        cellHeight: React.PropTypes.number
    };

    constructor(props) {
        super(props);

        this.setPage(1);
        this.setRows([]);

        let ds = null;
        if (this.props.withSections === true) {
            ds = new ListView.DataSource({
                rowHasChanged: this.props.rowHasChanged ? this.props.rowHasChanged : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
            });
            this.state = {
                dataSource: ds.cloneWithRowsAndSections(this.getRows()),
                isRefreshing: false,
                paginationStatus: PaginationStatus.firstLoad,
            };
        } else {
            ds = new ListView.DataSource({
                rowHasChanged: this.props.rowHasChanged ? this.props.rowHasChanged : (row1, row2) => row1 !== row2,
            });
            this.state = {
                dataSource: ds.cloneWithRows(this.getRows()),
                isRefreshing: false,
                paginationStatus: PaginationStatus.firstLoad,
            };
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setPage = (page) => {
        this.page = page;
    };

    getPage = () => {
        return this.page;
    };

    setRows = (rows) => {
        this.rows = rows;
    };

    getRows = () => {
        return this.rows;
    };

    sleep = (time) => {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    refresh = () => {
      this.onRefresh();
    };

    scrollTo = (option) => {
        this.scrollView.scrollTo(option);
    };

    scrollToEnd = (option) => {
        this.scrollView.scrollToEnd(option);
    };

    onRefresh = () => {
        //console.log('onRefresh()');
        if (this.mounted) {
            this.setState({
                isRefreshing: true
            });
            this.setPage(1);
            this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch);
        }
    };

    postRefresh = (rows = [], pageLimit) => {
        if (this.mounted) {
            let paginationStatus = PaginationStatus.waiting;
            if (rows.length < pageLimit) {
                paginationStatus = PaginationStatus.allLoaded;
            }
            this.updateRows(rows, paginationStatus);
        }
    };

    endFetch = () => {
        console.log('endRefresh()');
        if (this.props.refreshableMode === 'basic') {
            if (this.mounted) {
                this.setState({
                    isRefreshing: false
                });
            }
        } else {
            if (this.props.refreshable) this.scrollView.endRefresh();
        }
    };

    onPaginate = () => {
        if (this.state.paginationStatus === PaginationStatus.allLoaded) {
            return null;
        } else {
            this.setState({
                paginationStatus: PaginationStatus.waiting
            });
            this.props.onFetch(this.getPage() + 1, this.postPaginate, this.endFetch);
        }
    };

    postPaginate = (rows = []) => {
        this.setPage(this.getPage() + 1);
        let mergedRows = null;
        let paginationStatus;
        if (rows.length > 0) {
            if (this.props.withSections === true) {
                mergedRows = mergeRecursive(this.getRows(), rows);
            } else {
                mergedRows = this.getRows().concat(rows);
            }

            if (this.props.distinctRows) {
                mergedRows = this.props.distinctRows(mergedRows);
            }
            paginationStatus = PaginationStatus.waiting;
        } else {
            paginationStatus = PaginationStatus.allLoaded;
        }

        this.updateRows(mergedRows, paginationStatus);
    };

    updateRows = (rows = [], paginationStatus) => {
        if (rows !== null) {
            this.setRows(rows);
            if (this.props.withSections === true) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
                    isRefreshing: false,
                    paginationStatus: paginationStatus
                });
            } else {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rows),
                    isRefreshing: false,
                    paginationStatus: paginationStatus
                });
            }
        } else {
            this.setState({
                isRefreshing: false,
                paginationStatus: paginationStatus
            });
        }

        if (this.props.refreshableMode === 'advanced') {
            this.endFetch();
        }
    };

    updateDataSource(rows = []) {
        if (rows !== null) {
            this.setRows(rows);
            if (this.props.withSections === true) {
                this.setState({
                    isRefreshing: false,
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(rows)
                });
            } else {
                this.setState({
                    isRefreshing: false,
                    dataSource: this.state.dataSource.cloneWithRows(rows)
                });
            }
        } else {
            this.setState({
                isRefreshing: false
            });
        }
    }

    onEndReached = () => {
        //console.log('onEndReached()');
        if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination) {
            this.onPaginate();
        }
    };

    emptyView = () => {
        if (this.props.emptyView) {
            return this.props.emptyView();
        }

        return (
            <View style={styles.emptyView}>
                <Text style={{alignSelf: 'center'}}>
                    Sorry, there is no content to display
                </Text>
                <Text style={{alignSelf: 'center'}}>
                    (Pull down to refresh)
                </Text>
            </View>
        );
    };

    paginationFetchingView = () => {
        if (this.props.paginationFetchingView) {
            return this.props.paginationFetchingView();
        }

        return (
            <View style={styles.fetchingView}>
                <Text style={styles.paginationViewText}>{this.props.waitingSpinnerText}</Text>
            </View>
        );
    };

    paginationAllLoadedView = () => {
        if (this.props.paginationAllLoadedView) {
            return this.props.paginationAllLoadedView();
        }

        return (
            <View style={styles.paginationView}>
                <Text style={{alignSelf: 'center'}}>
                    {this.props.allLoadedText}
                </Text>
            </View>
        );
    };

    paginationWaitingView = (paginateCallback) => {
        if (this.props.paginationWaitingView) {
            return this.props.paginationWaitingView(paginateCallback);
        }

        if (this.props.autoPagination) {
            return (
                <View style={styles.paginationView}>
                    <ActivityIndicator color={this.props.spinnerColor} size={this.props.waitingSpinnerSize}/>
                    <Text style={[styles.paginationViewText, {marginLeft: 5}]}>{this.props.waitingSpinnerText}</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={paginateCallback}
                style={styles.paginationBtn}
            >
                <Text style={styles.paginationBtnText}>
                    {this.props.paginationBtnText}
                </Text>
            </TouchableOpacity>
        );
    };

    renderHeaderView = () => {
        if (this.state.paginationStatus === PaginationStatus.firstLoad || !this.props.headerView) {
            return null;
        }

        return this.props.headerView();
    };

    renderRowView = (rowData, sectionID, rowID) => {
        if (this.props.rowView && this.props.gridView === false) {
            return this.props.rowView(rowData, sectionID, rowID);
        } else if (this.props.rowView && this.props.gridView === true) {
            if (this.props.separator === true) {
                throw 'If you are using gridView mode, please make sure you set the separator props to false';
            }

            const borderStyle = {
                borderWidth: 0.3,
                borderColor: 'lightgray'
            };

            const cellWidth = this.props.cellWidth ? this.props.cellWidth : width / this.props.gridColumn;
            const cellHeight = this.props.cellHeight ? this.props.cellHeight : width / this.props.gridColumn;
            return (
                <View style={this.props.gridBorder ? [borderStyle, styles.gridItem, {
                        width: cellWidth,
                        height: cellHeight
                    }] : [styles.gridItem, {
                        width: cellWidth,
                        height: cellHeight
                    }]
                }>
                    {this.props.rowView(rowData, sectionID, rowID)}
                </View>
            );
        }

        return null;
    };

    renderSeparatorView = (sectionID, rowID) => {
        if (this.props.separator === true) {
            return (
                <View key={rowID} style={styles.separator}/>
            );
        } else if (typeof this.props.separator === 'function') {
            return this.props.separator(sectionID, rowID);
        }

        return null;
    };

    renderFooterView = () => {
        if (this.state.paginationStatus === PaginationStatus.firstLoad && this.props.firstLoader === true) {
            return this.paginationFetchingView();
        } else if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === false && (this.props.withSections === true || this.getRows().length > 0)) {
            return this.paginationWaitingView(this.onPaginate);
        } else if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === true && (this.props.withSections === true || this.getRows().length > 0)) {
            return this.paginationWaitingView();
        } else if (this.getRows().length !== 0 && this.state.paginationStatus === PaginationStatus.allLoaded) {
            return this.paginationAllLoadedView();
        } else if (this.getRows().length === 0) {
            return this.emptyView();
        }

        return null;
    };

    renderScrollComponent = (props) => {
        if (this.props.refreshableMode === 'advanced' && this.props.refreshable) {
            return (
                <RefreshableScrollView
                    {...props}
                    onRefresh={this.onRefresh}
                    paginationStatus={this.state.paginationStatus}
                    ref={(ref) => this.scrollView = ref}/>
            );
        }

        return (
            <ScrollView
                {...props}
                ref={(ref) => this.scrollView = ref}/>
        );
    };

    renderRefreshControl = () => {
        if (this.props.refreshableMode === 'basic' && this.props.refreshable) {
            if (this.props.renderRefreshControl) {
                return this.props.renderRefreshControl({onRefresh: this.onRefresh});
            }

            return (
                <RefreshControl
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    colors={this.props.refreshableColors}
                    progressBackgroundColor={this.props.refreshableProgressBackgroundColor}
                    size={this.props.refreshableSize}
                    tintColor={this.props.refreshableTintColor}
                    title={this.props.refreshableTitlePull}
                />
            );
        }

        return null;
    };

    contentContainerStyle() {
        if (this.props.gridView) {
            return styles.gridView;
        } else {
            if (Platform.OS === 'ios') {
                return undefined;
            } else {
                if (this.props.customRefreshViewHeight !== -1) {
                    return {minHeight: height + this.props.customRefreshViewHeight - 20};
                }
                return {minHeight: height + 70};
            }
        }
    }

    render() {
        return (
            <ListView
                ref={(ref) => this.listView = ref}
                style={this.props.style}
                dataSource={this.state.dataSource}
                automaticallyAdjustContentInsets={false}
                scrollEnabled={this.props.scrollEnabled}
                canCancelContentTouches={true}

                renderRow={this.renderRowView}
                renderSectionHeader={this.props.sectionHeaderView}
                renderHeader={this.renderHeaderView}
                renderFooter={this.renderFooterView}
                renderSeparator={this.renderSeparatorView}

                renderScrollComponent={this.renderScrollComponent}
                refreshControl={this.renderRefreshControl()}

                onEndReached={this.onEndReached}
                onEndReachedThreshold={this.props.onEndReachedThreshold}

                contentContainerStyle={this.contentContainerStyle()}
                {...this.props}
            />
        );
    }
}

const styles = StyleSheet.create({
    fetchingView: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
    },
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