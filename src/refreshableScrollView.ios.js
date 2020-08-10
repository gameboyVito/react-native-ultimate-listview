import React from 'react'
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import dateFormat from './util'

const DATE_KEY = 'ultimateRefreshDate'
const RefreshStatus = {
  pullToRefresh: 0,
  releaseToRefresh: 1,
  refreshing: 2
}
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2
}

export default class RefreshableScrollView extends React.Component {
  static defaultProps = {
    horizontal: false,
    scrollEnabled: true,
    header: null,
    refreshable: true,
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
    insideOfUltimateListView: false
  }

  _offsetY = 0
  _isRefreshing = false
  _dragFlag = false

  constructor(props) {
    super(props)
    this.state = {
      arrowAngle: new Animated.Value(0),
      refreshStatus: RefreshStatus.pullToRefresh,
      refreshTitle: this.props.refreshableTitlePull,
      date: this.props.date
    }
  }

  async componentDidMount() {
    try {
      let result = await AsyncStorage.getItem(DATE_KEY)
      if (result) {
        result = parseInt(result, 10)
        this.setState({
          date: dateFormat(new Date(result), this.props.dateFormat)
        })
      } else {
        this.setState({
          date: dateFormat(new Date(), this.props.dateFormat)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  onScroll = (event) => {
    // console.log('onScroll()');
    const { y } = event.nativeEvent.contentOffset
    this._offsetY = y
    if (this._dragFlag) {
      if (!this._isRefreshing) {
        const height = this.props.refreshViewHeight
        if (y <= -height) {
          this.setState({
            refreshStatus: RefreshStatus.releaseToRefresh,
            refreshTitle: this.props.refreshableTitleRelease
          })
          Animated.timing(this.state.arrowAngle, {
            toValue: 1,
            duration: 50,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }).start()
        } else {
          this.setState({
            refreshStatus: RefreshStatus.pullToRefresh,
            refreshTitle: this.props.refreshableTitlePull
          })
          Animated.timing(this.state.arrowAngle, {
            toValue: 0,
            duration: 50,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }).start()
        }
      }
    }
    if (this.props.onScroll) {
      this.props.onScroll(event)
    }
  }

  onScrollBeginDrag = (event) => {
    // console.log('onScrollBeginDrag()');
    this._dragFlag = true
    this._offsetY = event.nativeEvent.contentOffset.y
    if (this.props.onScrollBeginDrag) {
      this.props.onScrollBeginDrag(event)
    }
  }

  onScrollEndDrag = (event) => {
    // console.log('onScrollEndDrag()');
    this._dragFlag = false
    const { y } = event.nativeEvent.contentOffset
    this._offsetY = y
    const height = this.props.refreshViewHeight
    if (!this._isRefreshing) {
      if (this.state.refreshStatus === RefreshStatus.releaseToRefresh) {
        this._isRefreshing = true
        this.setState({
          refreshStatus: RefreshStatus.refreshing,
          refreshTitle: this.props.refreshableTitleRefreshing
        })
        this._scrollview.scrollTo({ x: 0, y: -height, animated: true })
        if (this.props.insideOfUltimateListView) {
          this.props.onRefresh()
        } else {
          this.props.onRefresh(() => {
            this.onRefreshEnd()
          })
        }
      }
    } else if (y <= 0) {
      this._scrollview.scrollTo({ x: 0, y: -height, animated: true })
    }
    if (this.props.onScrollEndDrag) {
      this.props.onScrollEndDrag(event)
    }
  }

  scrollTo = (option) => {
    this._scrollview.scrollTo(option)
  }

  scrollToEnd = (option) => {
    this._scrollview.scrollToEnd(option)
  }

  onRefreshEnd = () => {
    // console.log('onRefreshEnd()');
    if (this.state.refreshStatus === RefreshStatus.refreshing) {
      this._isRefreshing = false
      const now = new Date().getTime()
      this.setState({
        refreshStatus: RefreshStatus.pullToRefresh,
        refreshTitle: this.props.refreshableTitlePull,
        date: dateFormat(now, this.props.dateFormat)
      })
      AsyncStorage.setItem(DATE_KEY, now.toString())
      Animated.timing(this.state.arrowAngle, {
        toValue: 0,
        duration: 50,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start()
      this._scrollview.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  renderRefreshHeader() {
    if (this.props.customRefreshView) {
      return (
        <View style={[defaultHeaderStyles.header, this.props.refreshViewStyle]}>
          {this.props.customRefreshView(this.state.refreshStatus, this._offsetY)}
        </View>
      )
    }

    return (
      <View style={[defaultHeaderStyles.header, this.props.refreshViewStyle]}>
        <View style={defaultHeaderStyles.status}>
          {this.renderSpinner()}
          <Text style={defaultHeaderStyles.statusTitle}>{this.state.refreshTitle}</Text>
        </View>
        {this.props.displayDate &&
        <Text style={[defaultHeaderStyles.date, this.props.dateStyle]}>{this.props.dateTitle + this.state.date}</Text>
        }
      </View>
    )
  }

  renderSpinner() {
    if (this.state.refreshStatus === RefreshStatus.refreshing) {
      return (
        <ActivityIndicator style={{ marginRight: 10 }} />
      )
    }
    return (
      <Animated.Image
        source={this.props.arrowImageSource}
        resizeMode="contain"
        style={[defaultHeaderStyles.arrow,
          this.props.arrowImageStyle,
          {
            transform: [{
              rotateX: this.state.arrowAngle.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
              })
            }]
          }]}
      />
    )
  }

  render() {
    return (
      <ScrollView
        ref={c => this._scrollview = c}
        {...this.props}
        scrollEventThrottle={16}
        onScroll={this.onScroll}
        onScrollEndDrag={this.onScrollEndDrag}
        onScrollBeginDrag={this.onScrollBeginDrag}
      >
        {this.renderRefreshHeader()}
        {this.props.children}
      </ScrollView>
    )
  }
}

const defaultHeaderStyles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrow: {
    width: 23,
    height: 23,
    marginRight: 10,
    opacity: 0.4
  },
  statusTitle: {
    fontSize: 13,
    color: '#333333'
  },
  date: {
    fontSize: 11,
    color: '#333333',
    marginTop: 5
  }
})
