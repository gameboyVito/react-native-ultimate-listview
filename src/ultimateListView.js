import React, {Component} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
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
        initialNumToRender: 10,
        horizontal: false,

        firstLoader: true,
        scrollEnabled: true,
        onFetch: null,
        enableEmptySections: true,

        //Custom View
        header: null,
        item: null,
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
        pagination: true,
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
        numColumns: 1
    };

    static propTypes = {
        initialNumToRender: React.PropTypes.number,
        horizontal: React.PropTypes.bool,

        firstLoader: React.PropTypes.bool,
        scrollEnabled: React.PropTypes.bool,
        onFetch: React.PropTypes.func,
        enableEmptySections: React.PropTypes.bool,

        //Custom ListView
        header: React.PropTypes.func,
        item: React.PropTypes.func,
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
        pagination: React.PropTypes.bool,
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
        numColumns: React.PropTypes.number
    };

    constructor(props) {
        super(props);
        this.setPage(1);
        this.setRows([]);

        this.state = {
            dataSource: [],
            isRefreshing: false,
            paginationStatus: PaginationStatus.firstLoad,
        };
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.firstLoader) {
            this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch);
        }
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

    scrollToOffset = (option) => {
        this._flatList.scrollToOffset(option);
    };

    scrollToIndex = (option) => {
        this._flatList.scrollToIndex(option);
    };

    scrollToItem = (option) => {
        this._flatList.scrollToItem(option);
    };

    scrollToEnd = (option) => {
        this._flatList.scrollToEnd(option);
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
                    this._flatList._listRef._scrollRef.endRefresh();
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
        let mergedRows;
        let paginationStatus;
        if (rows.length === 0) {
            paginationStatus = PaginationStatus.allLoaded;
        } else {
            mergedRows = this.getRows().concat(rows);
            paginationStatus = PaginationStatus.waiting;
        }

        this.updateRows(mergedRows, paginationStatus);
    };

    updateRows = (rows, paginationStatus) => {
        if (rows) {
            this.setRows(rows);
            this.setState({
                dataSource: rows,
                isRefreshing: false,
                paginationStatus: paginationStatus
            });
        } else {
            this.setState({
                dataSource: this.getRows().slice(),
                isRefreshing: false,
                paginationStatus: paginationStatus
            });
        }

        if (this.props.refreshableMode === 'advanced') {
            this.endFetch();
        }
    };

    updateDataSource(rows = []) {
        this.setRows(rows);
        this.setState({
            dataSource: rows
        });
    }

    onEndReached = () => {
        //console.log('onEndReached()');
        if (this.props.pagination && this.props.autoPagination && this.state.paginationStatus === PaginationStatus.waiting) {
            this.onPaginate();
        }
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
        if (this.props.pagination) {
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
        }

        return null;
    };

    paginationWaitingView = (paginateCallback) => {
        if (this.props.pagination) {
            if (this.props.autoPagination) {
                if (this.props.paginationWaitingView) {
                    return this.props.paginationWaitingView(paginateCallback);
                }

                return (
                    <View style={styles.paginationView}>
                        <ActivityIndicator color={this.props.spinnerColor} size={this.props.waitingSpinnerSize}/>
                        <Text
                            style={[styles.paginationViewText, {marginLeft: 5}]}>{this.props.waitingSpinnerText}</Text>
                    </View>
                );
            }
        }

        return null;
    };

    renderHeader = () => {
        if (this.props.header) {
            return this.props.header();
        }

        return null;
    };

    renderItem = ({item, index, separators}) => {
        if (this.props.item) {
            return this.props.item(item, index, separators);
        }

        return null;
    };

    renderSeparator = () => {
        if (this.props.separator) {
            if (this.props.numColumns > 1) {
                return null;
            }

            return this.props.separator();
        }

        return null;
    };

    renderEmptyView = () => {
        if (this.state.paginationStatus !== PaginationStatus.firstLoad && this.props.emptyView) {
            return this.props.emptyView();
        }

        return null;
    };

    renderFooter = () => {
        if (this.state.paginationStatus === PaginationStatus.firstLoad) {
            return this.paginationFetchingView();
        } else if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === false) {
            return this.paginationWaitingView(this.onPaginate);
        } else if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === true) {
            return this.paginationWaitingView();
        } else if (this.state.paginationStatus === PaginationStatus.allLoaded) {
            return this.paginationAllLoadedView();
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
            return null;
        }

        if (this.props.customRefreshViewHeight !== -1) {
            return {minHeight: height + this.props.customRefreshViewHeight};
        }

        return {minHeight: height + headerHeight};
    }

    render() {
        const {numColumns} = this.props;
        return (
            <FlatList renderScrollComponent={this.renderScrollComponent}
                      onEndReachedThreshold={0.1}
                      key={numColumns}
                      {...this.props}
                      ref={(ref) => this._flatList = ref}
                      removeClippedSubviews={false}
                      data={this.state.dataSource}
                      renderItem={this.renderItem}
                      ItemSeparatorComponent={this.renderSeparator}
                      ListHeaderComponent={this.renderHeader}
                      ListFooterComponent={this.renderFooter}
                      ListEmptyComponent={this.renderEmptyView}
                      onEndReached={this.onEndReached}
                      refreshControl={this.renderRefreshControl()}
                      contentContainerStyle={this.contentContainerStyle()}
                      numColumns={numColumns}/>
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
        flex: 1,
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