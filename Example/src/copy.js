import React, {Component} from "react";
import {
    ListView,
    Platform,
    TouchableOpacity,
    View,
    Text,
    RefreshControl,
    ActivityIndicator,
    Dimensions
} from "react-native";
import styles from "./styles";

// Get width and height of the current device
const {width, height} = Dimensions.get('window');

// A helper function merged two objects into one
const MergeRecursive = (obj1, obj2) => {
    for (let p in obj2) {
        try {
            if (obj2[p].constructor == Object) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch (e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
};

export default class UltimateListView extends Component {

    static defaultProps = {
        initialListSize: 10,
        firstLoader: true,
        scrollEnabled: true,
        withSections: false,
        rowHasChanged: null,
        distinctRows: null,
        onFetch(page, callback, options) {
            callback([]);
        },

        //Custom View
        headerView: null,
        rowView: null,
        sectionHeaderView: null,
        paginationFetchingView: null,
        paginationAllLoadedView: null,
        paginationWaitingView: null,
        emptyView: null,
        separator: null,

        //refreshable
        refreshable: true,
        refreshableColors: ['dimgray', 'tomato', 'limegreen'],
        refreshableProgressBackgroundColor: 'white',
        refreshableSize: undefined,
        refreshableTitleWillRefresh: 'Pull To Refresh',
        refreshableTitleInRefreshing: 'Pull To Refresh',
        refreshableTintColor: 'lightgray',
        renderRefreshControl: null,

        //pagination
        autoPagination: true,
        onEndReachedThreshold: 50,
        allLoadedText: 'The End',

        //spinner
        spinnerColor: 'gray',
        fetchingSpinnerSize: 'large',
        waitingSpinnerSize: 'small',
        waitingSpinnerText: 'Loading...',

        //pagination-button
        paginationBtnText: 'Load more...',

        //grid-view
        gridView: false,
        gridColumn: 2,
        gridBorder: true,
        pageSize: 1,
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

        //Custom View
        headerView: React.PropTypes.func,
        rowView: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        paginationFetchingView: React.PropTypes.func,
        paginationAllLoadedView: React.PropTypes.func,
        paginationWaitingView: React.PropTypes.func,
        emptyView: React.PropTypes.func,
        separator: React.PropTypes.any,

        //refreshable
        refreshable: React.PropTypes.bool,
        refreshableColors: React.PropTypes.array,
        refreshableProgressBackgroundColor: React.PropTypes.string,
        refreshableSize: React.PropTypes.string,
        refreshableTitleWillRefresh: React.PropTypes.string,
        refreshableTitleInRefreshing: React.PropTypes.string,
        refreshableTintColor: React.PropTypes.string,
        renderRefreshControl: React.PropTypes.func,

        //pagination
        autoPagination: React.PropTypes.bool,
        onEndReachedThreshold: React.PropTypes.number,
        allLoadedText: React.PropTypes.string,

        //spinner
        spinnerColor: React.PropTypes.string,
        fetchingSpinnerSize: React.PropTypes.any,
        waitingSpinnerSize: React.PropTypes.any,
        waitingSpinnerText: React.PropTypes.string,

        //pagination-button
        paginationBtnText: React.PropTypes.string,

        //grid-view
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
                paginationStatus: 'firstLoad',
            };
        } else {
            ds = new ListView.DataSource({
                rowHasChanged: this.props.rowHasChanged ? this.props.rowHasChanged : (row1, row2) => row1 !== row2,
            });
            this.state = {
                dataSource: ds.cloneWithRows(this.getRows()),
                isRefreshing: false,
                paginationStatus: 'firstLoad',
            };
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.props.onFetch(this.getPage(), this.postRefresh, {firstLoad: true});
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
            <View style={styles.paginationView}>
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
        console.log(this.state.paginationStatus)
        if (this.state.paginationStatus === 'firstLoad' || !this.props.headerView) {
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

            const cellWidth = this.props.cellWidth? this.props.cellWidth : width / this.props.gridColumn;
            const cellHeight = this.props.cellHeight ? this.props.cellHeight: width / this.props.gridColumn;
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
        if ((this.state.paginationStatus === 'fetching') || (this.state.paginationStatus === 'firstLoad' && this.props.firstLoader === true)) {
            return this.paginationFetchingView();
        } else if (this.state.paginationStatus === 'waiting' && this.props.autoPagination === false && (this.props.withSections === true || this.getRows().length > 0)) {
            return this.paginationWaitingView(this.onPaginate);
        } else if (this.state.paginationStatus === 'waiting' && this.props.autoPagination === true && (this.props.withSections === true || this.getRows().length > 0)) {
            return this.paginationWaitingView();
        } else if (this.getRows().length !== 0 && this.state.paginationStatus === 'allLoaded') {
            return this.paginationAllLoadedView();
        } else if (this.getRows().length === 0) {
            return this.emptyView();
        }

        return null;
    };

    renderRefreshControl = () => {
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
                title={this.state.isRefreshing ? this.props.refreshableTitleInRefreshing : this.props.refreshableTitleWillRefresh}
            />
        );
    };

    refresh = () => {
        this.onRefresh({external: true});
    };

    stopRefresh = () => {
        if (this.mounted) {
            this.setState({
                isRefreshing: false
            });
        }
    };

    onRefresh = (options = {}) => {
        if (this.mounted) {
            this.setState({
                isRefreshing: true
            });
            this.setPage(1);
            this.props.onFetch(this.getPage(), this.postRefresh, options);
        }
    };

    postRefresh = (rows = [], options = {}) => {
        if (this.mounted) {
            if (rows.length < options.pageLimit) {
                options.allLoaded = true;
            }
            this.updateRows(rows, options);
        }
    };

    onPaginate = () => {
        if (this.state.paginationStatus === 'allLoaded') {
            return null;
        } else {
            this.setState({
                paginationStatus: 'waiting',
            });
            this.props.onFetch(this.getPage() + 1, this.postPaginate, {});
        }
    };

    postPaginate = (rows = [], options = {}) => {
        this.setPage(this.getPage() + 1);
        let mergedRows = null;

        if (rows.length > 0) {
            if (this.props.withSections === true) {
                mergedRows = MergeRecursive(this.getRows(), rows);
            } else {
                mergedRows = this.getRows().concat(rows);
            }

            if (this.props.distinctRows) {
                mergedRows = this.props.distinctRows(mergedRows);
            }
            options.allLoaded = false;
        } else {
            options.allLoaded = true;
        }

        this.updateRows(mergedRows, options);
    };

    updateRows = async (rows = [], options = {}) => {
        let paginationStatus = options.allLoaded ? 'allLoaded' : 'waiting';
        if (options.external) {
            this.updateRowsByExternal(rows);
        } else {
            if (rows !== null) {
                this.setRows(rows);
                if (this.props.withSections === true) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
                        isRefreshing: false,
                        paginationStatus: paginationStatus,
                    });
                } else {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(rows),
                        isRefreshing: false,
                        paginationStatus: paginationStatus,
                    });
                }
            } else {
                this.setState({
                    isRefreshing: false,
                    paginationStatus: paginationStatus,
                });
            }
        }
    };

    updateRowsByExternal(rows = []) {
        if (rows !== null) {
            this.setRows(rows);
            if (this.props.withSections === true) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
                    isRefreshing: false
                });
            } else {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rows),
                    isRefreshing: false
                });
            }
        } else {
            this.setState({
                isRefreshing: false
            });
        }
    }

    onEndReached = () => {
        if (this.state.paginationStatus === 'waiting' && this.props.autoPagination) {
            this.onPaginate();
        }
    };

    render() {
        return (
            <ListView
                ref="listview"
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

                refreshControl={this.props.refreshable === true ? this.renderRefreshControl() : null}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={this.props.onEndReachedThreshold}

                contentContainerStyle={this.props.gridView ? styles.gridView : undefined}
                {...this.props}
            />
        );
    }
}