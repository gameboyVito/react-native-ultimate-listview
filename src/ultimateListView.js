import React, {Component} from "react";
import {
    FlatList,
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
const headerHeight = 80;
export default class UltimateListView extends Component {

    static defaultProps = {
        initialNum: 10,
        initialListSize: 10,

        firstLoader: true,
        scrollEnabled: true,
        withSections: false,
        rowHasChanged: null,
        distinctRows: null,
        onFetch: null,
        enableEmptySections: true,

        //new props - true to use ListView, false to use FlatList
        legacyImplementation: false,

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
        refreshableTitle: null,
        refreshableColors: ['dimgray', 'tomato', 'limegreen'],
        refreshableProgressBackgroundColor: 'white',
        refreshableSize: undefined,
        refreshableTintColor: 'lightgray',
        customRefreshControl: null,

        //Advanced RefreshView
        refreshableTitlePull: 'Pull down to refresh',
        refreshableTitleRefreshing: 'Loading...',
        refreshableTitleRelease: 'Release to refresh',
        customRefreshView: null,
        customRefreshViewHeight: -1,
        displayDate: true,
        dateFormat: 'yyyy-MM-dd hh:mm',
        dateTitle: 'Last updated time: ',
        arrowImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABD0lEQVRIS92V7w2BMRCHHxMwAhNgAmxgBCuYABtYwQY2wASYgBGYgPySEpq2d6+8EXFf+qHXe+5vr8GXpPElDj8JGgIzQKdkDSyAgycrVSKSwW5kdPcCLvKqgG4JS2egU3dEKZAYLmddSkAbOGU8d9lwKYU6bDKgvqch6gCNgK1Vp58DzcMMpRyfAsu6IiqBNLS6rzxH6rA90LIeZ+4vYbZ0PiVVo14AfcjhGsbBBAlQSpXlQLJmpa5Tyw4sq9H9Cpik3pRAqpFg8UeaYx/DYL+l7KFszZHqJVjTiCxZF6sZYpsWTBDtqOJesiJ6QHMwF8T9xQdaDHNDqoKkL5hWuAo+BrT4XOJNnctYSen/QHcJ7i8bTYJ5dAAAAABJRU5ErkJggg==',

        //Pagination
        autoPagination: true,
        allLoadedText: 'End of List',

        //Spinner
        spinnerColor: undefined,
        fetchingSpinnerSize: 'large',
        waitingSpinnerSize: 'small',
        waitingSpinnerText: 'Loading...',

        //Pagination Button
        paginationBtnText: 'Load more...',

        //GridView
        gridColumn: 1,
        cellContainerStyle: null,
        rowContainerStyle: null
    };

    static propTypes = {
        initialNum: React.PropTypes.number,
        initialListSize: React.PropTypes.number,

        firstLoader: React.PropTypes.bool,
        scrollEnabled: React.PropTypes.bool,
        withSections: React.PropTypes.bool,
        onFetch: React.PropTypes.func,
        rowHasChanged: React.PropTypes.func,
        distinctRows: React.PropTypes.func,
        enableEmptySections: React.PropTypes.bool,

        //new props - true to use ListView, false to use FlatList
        legacyImplementation: React.PropTypes.bool,

        //Custom ListView
        headerView: React.PropTypes.func,
        rowView: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        paginationFetchingView: React.PropTypes.func,
        paginationAllLoadedView: React.PropTypes.func,
        paginationWaitingView: React.PropTypes.func,
        emptyView: React.PropTypes.func,
        separator: React.PropTypes.func,

        //Refreshable
        refreshable: React.PropTypes.bool,
        refreshableMode: React.PropTypes.string,

        //RefreshControl
        refreshableTitle: React.PropTypes.string,
        refreshableColors: React.PropTypes.array,
        refreshableProgressBackgroundColor: React.PropTypes.string,
        refreshableSize: React.PropTypes.string,
        refreshableTintColor: React.PropTypes.string,
        customRefreshControl: React.PropTypes.func,

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
        allLoadedText: React.PropTypes.string,

        //Spinner
        spinnerColor: React.PropTypes.string,
        fetchingSpinnerSize: React.PropTypes.any,
        waitingSpinnerSize: React.PropTypes.any,
        waitingSpinnerText: React.PropTypes.string,

        //Pagination Button
        paginationBtnText: React.PropTypes.string,

        //GridView
        gridColumn: React.PropTypes.number,
        cellContainerStyle: React.PropTypes.object,
        rowContainerStyle: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.setPage(1);
        this.setRows([]);

        if (this.props.legacyImplementation) {
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
        } else {
            this.state = {
                dataSource: [],
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
        return new Promise(resolve => setTimeout(() => resolve(), time));
    };

    refresh = () => {
        this.onRefresh();
    };

    scrollTo = (option) => {
        if (this.props.legacyImplementation) {
            this.scrollView.scrollTo(option);
        } else {
            this.flatList.scrollToOffset(option);
        }
    };

    scrollToIndex = (option) => {
        if (this.props.legacyImplementation) {
            console.warn('Not support on ListView, use FlatList instead')
        } else {
            this.flatList.scrollToIndex(option);
        }
    };

    scrollToItem = (option) => {
        if (this.props.legacyImplementation) {
            console.warn('Not support on ListView, use FlatList instead')
        } else {
            this.flatList.scrollToItem(option);
        }
    };

    scrollToEnd = (option) => {
        if (this.props.legacyImplementation) {
            this.scrollView.scrollToEnd(option);
        } else {
            this.flatList.scrollToEnd(option);
        }
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
        //console.log('endRefresh()');
        if (this.mounted) {
            if (this.props.refreshableMode === 'basic') {
                this.setState({
                    isRefreshing: false
                });
            } else {
                if (this.props.refreshable) {
                    if (this.props.legacyImplementation) {
                        this.scrollView.endRefresh();
                    } else {
                        this.flatList._listRef._scrollRef.endRefresh();
                    }
                }
            }
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

    postPaginate = (rows = [], pageLimit) => {
        this.setPage(this.getPage() + 1);
        let mergedRows = null;
        let paginationStatus;
        if (rows.length === 0) {
            paginationStatus = PaginationStatus.allLoaded;
        } else {
            if (this.props.legacyImplementation) {
                if (this.props.withSections === true) {
                    mergedRows = mergeRecursive(this.getRows(), rows);
                } else {
                    mergedRows = this.getRows().concat(rows);
                }

                if (this.props.distinctRows) {
                    mergedRows = this.props.distinctRows(mergedRows);
                }
            } else {
                mergedRows = this.getRows().concat(rows);
            }
            paginationStatus = PaginationStatus.waiting;
        }

        this.updateRows(mergedRows, paginationStatus);
    };

    updateRows = (rows = [], paginationStatus) => {
        if (rows !== null) {
            this.setRows(rows);
            if (this.props.legacyImplementation) {
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
                    dataSource: rows,
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
            if (this.props.legacyImplementation) {
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
                    isRefreshing: false,
                    dataSource: rows
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
        if (this.props.headerView) {
            return this.props.headerView();
        }

        return null;
    };

    renderSectionHeader = (sectionData, sectionID) => {
        if (this.props.sectionHeaderView && this.props.legacyImplementation) {
            if (this.props.refreshableMode === 'basic') {
                return this.props.sectionHeaderView(sectionData, sectionID);
            }
            console.error('sectionHeader is not supported on AdvancedRefreshView, try to use basic RefreshControl instead');
        }

        return null;
    };

    renderItemView = ({item, index}) => {
        if (this.props.rowView) {
            return this.props.rowView(item, index);
        }

        return null;
    };

    renderRowView = (rowData, sectionID, rowID) => {
        if (this.props.rowView) {
            if (this.props.gridColumn > 1) {
                const cellWidth = width / this.props.gridColumn;
                const cellHeight = width / this.props.gridColumn;

                return (
                    <View style={this.props.cellContainerStyle ? this.props.cellContainerStyle : [styles.gridItem, {
                            width: cellWidth,
                            height: cellHeight
                        }]
                    }>
                        {this.props.rowView(rowData, sectionID, rowID)}
                    </View>
                );
            }

            return this.props.rowView(rowData, sectionID, rowID);
        }

        return null;
    };

    renderSeparatorView = (sectionID, rowID) => {
        if (this.props.separator) {
            if (this.props.gridColumn > 1) {
                return null;
            }

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
        if (this.props.refreshable && this.props.refreshableMode === 'advanced') {
            return (
                <RefreshableScrollView
                    {...props}
                    onRefresh={this.onRefresh}
                    paginationStatus={this.state.paginationStatus}
                    ref={(ref) => this.scrollView = ref}/>
            );
        }

        return (
            <ScrollView {...props}
                        ref={(ref) => this.scrollView = ref}/>
        );
    };

    renderRefreshControl = () => {
        if (this.props.refreshable && this.props.refreshableMode === 'basic') {
            if (this.props.customRefreshControl) {
                return this.props.customRefreshControl(this.state.isRefreshing, this.onRefresh);
            }

            return (
                <RefreshControl
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    colors={this.props.refreshableColors}
                    progressBackgroundColor={this.props.refreshableProgressBackgroundColor}
                    size={this.props.refreshableSize}
                    tintColor={this.props.refreshableTintColor}
                    title={this.props.refreshableTitle}
                />
            );
        }

        return null;
    };

    contentContainerStyle() {
        if (Platform.OS === 'ios') {
            if (this.props.gridColumn > 1 && this.props.legacyImplementation) {
                return styles.gridView;
            }
            return null;
        } else {
            let gridViewStyle = {};
            if (this.props.gridColumn > 1 && this.props.legacyImplementation) {
                if (this.props.refreshableMode === 'basic') {
                    return styles.gridView;
                } else {
                    console.error('AdvancedRefreshView of legacy ListView with grid layout only support iOS platform. Try to use FlatList instead, or use the default RefreshControl in Android.')
                }
            }

            if (this.props.customRefreshViewHeight !== -1) {
                return [{minHeight: height + this.props.customRefreshViewHeight}, gridViewStyle];
            }
            return [gridViewStyle, {minHeight: height + headerHeight}];
        }
    }

    rowContainerStyle() {
        if (this.props.gridColumn > 1) {
            if (this.props.rowContainerStyle) {
                return this.props.rowContainerStyle;
            }

            return {
                justifyContent: 'flex-start',
                height: 120,
                paddingHorizontal: 0,
                paddingTop: 20
            }
        }
    }

    render() {
        if (this.props.legacyImplementation) {
            return (
                <ListView renderScrollComponent={this.renderScrollComponent}
                          pageSize={this.props.gridColumn}
                          {...this.props}
                          ref={(ref) => this.listView = ref}
                          dataSource={this.state.dataSource}
                          enableEmptySections={this.props.enableEmptySections}
                          automaticallyAdjustContentInsets={false}
                          scrollEnabled={this.props.scrollEnabled}
                          canCancelContentTouches={true}
                          renderRow={this.renderRowView}
                          renderHeader={this.renderHeaderView}
                          renderSectionHeader={this.renderSectionHeader}
                          renderFooter={this.renderFooterView}
                          renderSeparator={this.renderSeparatorView}
                          refreshControl={this.renderRefreshControl()}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={50}
                          contentContainerStyle={this.contentContainerStyle()}
                />
            );
        }

        return (
            <FlatList renderScrollComponent={this.renderScrollComponent}
                      {...this.props}
                      ref={(ref) => this.flatList = ref}
                      removeClippedSubviews={false}
                      data={this.state.dataSource}
                      renderItem={this.renderItemView}
                      ItemSeparatorComponent={this.renderSeparatorView}
                      ListHeaderComponent={this.renderHeaderView}
                      ListFooterComponent={this.renderFooterView}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={0.1}
                      refreshControl={this.renderRefreshControl()}
                      contentContainerStyle={this.contentContainerStyle()}
                      numColumns={this.props.gridColumn}
                      columnWrapperStyle={this.rowContainerStyle()}
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
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    }
});