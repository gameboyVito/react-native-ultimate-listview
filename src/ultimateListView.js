import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import RefreshableScrollView from './refreshableScrollView'


const { width, height } = Dimensions.get('window')
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3
}

export default class UltimateListView extends Component {
  static defaultProps = {
    initialNumToRender: 10,
    horizontal: false,

    firstLoader: true,
    scrollEnabled: true,
    onFetch: null,
    enableEmptySections: true,

    // Custom View
    header: null,
    item: null,
    paginationFetchingView: null,
    paginationAllLoadedView: null,
    paginationWaitingView: null,
    emptyView: null,
    separator: null,

    // Refreshable
    refreshable: true,
    refreshableMode: 'basic', // basic or advanced

    // RefreshControl
    refreshableTitle: null,
    refreshableColors: ['dimgray', 'tomato', 'limegreen'],
    refreshableProgressBackgroundColor: 'white',
    refreshableSize: undefined,
    refreshableTintColor: 'lightgray',
    customRefreshControl: null,

    // Advanced RefreshView
    refreshableTitlePull: 'Pull to refresh',
    refreshableTitleRefreshing: 'Loading...',
    refreshableTitleRelease: 'Release to load',
    customRefreshView: null,
    displayDate: false,
    dateFormat: 'yyyy-MM-dd hh:mm',
    dateTitle: 'Last updated: ',
    arrowImageSource: require('./downArrow.png'),
    arrowImageStyle: undefined,
    refreshViewStyle: undefined,
    dateStyle: undefined,
    refreshViewHeight: 80,

    // Pagination
    pagination: true,
    autoPagination: true,
    allLoadedText: 'End of List',

    // Spinner
    spinnerColor: undefined,
    fetchingSpinnerSize: 'large',
    waitingSpinnerSize: 'small',
    waitingSpinnerText: 'Loading...',

    // Pagination Button
    paginationBtnText: 'Load more...',

    // GridView
    numColumns: 1
  }

  static propTypes = {
    initialNumToRender: PropTypes.number,
    horizontal: PropTypes.bool,

    firstLoader: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    onFetch: PropTypes.func,
    enableEmptySections: PropTypes.bool,

    // Custom ListView
    header: PropTypes.func,
    item: PropTypes.func,
    paginationFetchingView: PropTypes.func,
    paginationAllLoadedView: PropTypes.func,
    paginationWaitingView: PropTypes.func,
    emptyView: PropTypes.func,
    separator: PropTypes.func,

    // Refreshable
    refreshable: PropTypes.bool,
    refreshableMode: PropTypes.string,

    // RefreshControl
    refreshableTitle: PropTypes.string,
    refreshableColors: PropTypes.array,
    refreshableProgressBackgroundColor: PropTypes.string,
    refreshableSize: PropTypes.string,
    refreshableTintColor: PropTypes.string,
    customRefreshControl: PropTypes.func,

    // Advanced RefreshView
    refreshableTitlePull: PropTypes.string,
    refreshableTitleRefreshing: PropTypes.string,
    refreshableTitleRelease: PropTypes.string,
    customRefreshView: PropTypes.func,
    displayDate: PropTypes.bool,
    dateFormat: PropTypes.string,
    dateTitle: PropTypes.string,
    arrowImageSource: PropTypes.any,
    arrowImageStyle: PropTypes.object,
    refreshViewStyle: PropTypes.object,
    dateStyle: PropTypes.object,
    refreshViewHeight: PropTypes.number,


    // Pagination
    pagination: PropTypes.bool,
    autoPagination: PropTypes.bool,
    allLoadedText: PropTypes.string,

    // Spinner
    spinnerColor: PropTypes.string,
    fetchingSpinnerSize: PropTypes.any,
    waitingSpinnerSize: PropTypes.any,
    waitingSpinnerText: PropTypes.string,

    // Pagination Button
    paginationBtnText: PropTypes.string,

    // GridView
    numColumns: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.setPage(1)
    this.setRows([])

    this.state = {
      dataSource: [],
      isRefreshing: false,
      paginationStatus: PaginationStatus.firstLoad
    }
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.firstLoader) {
      this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  onRefresh = () => {
    console.log('onRefresh()')
    if (this.mounted) {
      this.setState({
        isRefreshing: true
      })
      this.setPage(1)
      this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch)
    }
  }

  onPaginate = async () => {
    if (this.state.paginationStatus !== PaginationStatus.allLoaded && !this.state.isRefreshing) {
      console.log('onPaginate()')
      await this.setState({ paginationStatus: PaginationStatus.fetching })
      this.props.onFetch(this.getPage() + 1, this.postPaginate, this.endFetch)
    }
  }

  onEndReached = async () => {
    // console.log('onEndReached()');
    if (this.props.pagination && this.props.autoPagination && this.state.paginationStatus === PaginationStatus.waiting) {
      this.onPaginate()
    }
  }

  setPage = page => this.page = page

  getPage = () => this.page

  setRows = rows => this.rows = rows

  getRows = () => this.rows

  sleep = time => new Promise(resolve => setTimeout(() => resolve(), time))

  refresh = () => {
    this.onRefresh()
  }

  scrollToOffset = (option) => {
    this._flatList.scrollToOffset(option)
  }

  scrollToIndex = (option) => {
    this._flatList.scrollToIndex(option)
  }

  scrollToItem = (option) => {
    this._flatList.scrollToItem(option)
  }

  scrollToEnd = (option) => {
    this._flatList.scrollToEnd(option)
  }

  postRefresh = (rows = [], pageLimit) => {
    if (this.mounted) {
      let paginationStatus = PaginationStatus.waiting
      if (rows.length < pageLimit) {
        paginationStatus = PaginationStatus.allLoaded
      }
      this.updateRows(rows, paginationStatus)
    }
  }

  endFetch = () => {
    // console.log('endRefresh()');
    if (this.mounted) {
      this.setState({ isRefreshing: false, paginationStatus: PaginationStatus.allLoaded })
      if (this.props.refreshableMode === 'advanced' && this._flatList._listRef._scrollRef.onRefreshEnd) {
        this._flatList._listRef._scrollRef.onRefreshEnd()
      }
    }
  }

  postPaginate = (rows = [], pageLimit) => {
    this.setPage(this.getPage() + 1)
    let mergedRows
    let paginationStatus
    if (rows.length === 0) {
      paginationStatus = PaginationStatus.allLoaded
    } else {
      mergedRows = this.getRows().concat(rows)
      paginationStatus = PaginationStatus.waiting
    }

    this.updateRows(mergedRows, paginationStatus)
  }

  updateRows = (rows, paginationStatus) => {
    if (rows) {
      this.setRows(rows)
      this.setState({
        dataSource: rows,
        isRefreshing: false,
        paginationStatus
      })
    } else {
      this.setState({
        dataSource: this.getRows().slice(),
        isRefreshing: false,
        paginationStatus
      })
    }

    if (this.props.refreshableMode === 'advanced') {
      this.endFetch()
    }
  }

  updateDataSource(rows = []) {
    this.setRows(rows)
    this.setState({
      dataSource: rows
    })
  }

  paginationFetchingView = () => {
    if (this.props.paginationFetchingView) {
      return this.props.paginationFetchingView()
    }

    return (
      <View style={styles.fetchingView}>
        <Text style={styles.paginationViewText}>{this.props.waitingSpinnerText}</Text>
      </View>
    )
  }

  paginationAllLoadedView = () => {
    if (this.props.pagination) {
      if (this.props.paginationAllLoadedView) {
        return this.props.paginationAllLoadedView()
      }

      return (
        <View style={styles.paginationView}>
          <Text style={styles.allLoadedText}>
            {this.props.allLoadedText}
          </Text>
        </View>
      )
    }

    return null
  }

  paginationWaitingView = (paginateCallback) => {
    if (this.props.pagination) {
      if (this.props.autoPagination) {
        if (this.props.paginationWaitingView) {
          return this.props.paginationWaitingView(paginateCallback)
        }

        return (
          <View style={styles.paginationView}>
            <ActivityIndicator color={this.props.spinnerColor} size={this.props.waitingSpinnerSize} />
            <Text
              style={[styles.paginationViewText, { marginLeft: 5 }]}
            >{this.props.waitingSpinnerText}
            </Text>
          </View>
        )
      }
    }

    return null
  }

  renderHeader = () => {
    if (this.props.header) {
      return this.props.header()
    }

    return null
  }

  renderItem = ({ item, index, separators }) => {
    if (this.props.item) {
      return this.props.item(item, index, separators)
    }

    return null
  }

  renderSeparator = () => {
    if (this.props.separator) {
      if (this.props.numColumns > 1) {
        return null
      }

      return this.props.separator()
    }

    return null
  }

  renderEmptyView = () => {
    if (this.state.paginationStatus !== PaginationStatus.firstLoad && this.props.emptyView) {
      return this.props.emptyView()
    }

    return null
  }

  renderFooter = () => {
    if (this.state.paginationStatus === PaginationStatus.firstLoad) {
      return this.paginationFetchingView()
    } else if (this.state.paginationStatus === PaginationStatus.fetching && this.props.autoPagination === false) {
      return this.paginationWaitingView(this.onPaginate)
    } else if (this.state.paginationStatus === PaginationStatus.fetching && this.props.autoPagination === true) {
      return this.paginationWaitingView()
    } else if (this.getRows().length !== 0 && this.state.paginationStatus === PaginationStatus.allLoaded) {
      return this.paginationAllLoadedView()
    }

    return null
  }

  renderScrollComponent = (props) => {
    if (this.props.refreshable && this.props.refreshableMode === 'advanced') {
      return (
        <RefreshableScrollView
          {...props}
          insideOfUltimateListView
          onRefresh={this.onRefresh}
          ref={ref => this.scrollView = ref}
        />
      )
    }

    return (
      <ScrollView
        {...props}
        ref={ref => this.scrollView = ref}
      />
    )
  }

  renderRefreshControl = () => {
    if (this.props.refreshable && this.props.refreshableMode === 'basic') {
      if (this.props.customRefreshControl) {
        return this.props.customRefreshControl(this.state.isRefreshing, this.onRefresh)
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
      )
    }

    return null
  }

  render() {
    const { numColumns } = this.props
    return (
      <FlatList
        renderScrollComponent={this.renderScrollComponent}
        key={numColumns}
        onEndReachedThreshold={0.1}
        {...this.props}
        ref={ref => this._flatList = ref}
        data={this.state.dataSource}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.renderEmptyView}
        onEndReached={this.onEndReached}
        refreshControl={this.renderRefreshControl()}
        numColumns={numColumns}
      />
    )
  }
}

const styles = StyleSheet.create({
  fetchingView: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationView: {
    flex: 0,
    width,
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
    alignItems: 'center'
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
    alignSelf: 'center',
    color: '#bfbfbf'
  },
  gridItem: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }
})
