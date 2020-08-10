import React from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import dateFormat from './util'

const { width, height } = Dimensions.get('window')
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
      refreshStatus: RefreshStatus.refreshing,
      refreshTitle: this.props.refreshableTitleRefreshing,
      date: this.props.date,
      showRefreshHeader: false
    }
  }

  async componentDidMount() {
    console.warn('The advancedRefreshView is not ready for Android at this moment. \n\nIf the items are less than the height of device screen, the refreshView will not disappear. \n\nPlease consider setting the refreshableMode={Platform.OS === "ios" ? "advanced" : "basic"}, or feel free to send me a PR to resolve this problem. \n\nThanks a lot.')
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
    const { refreshViewHeight } = this.props
    if (y <= refreshViewHeight) {
      this._offsetY = y - refreshViewHeight
    }
    if (this._dragFlag) {
      if (!this._isRefreshing) {
        if (y <= 10) {
          if (this.state.refreshStatus !== RefreshStatus.releaseToRefresh) {
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
          }
        } else if (this.state.refreshStatus !== RefreshStatus.pullToRefresh) {
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
    } else if (y <= 5) {
      setTimeout(() => this._scrollview.scrollTo({ x: 0, y: refreshViewHeight, animated: false }), 100)
    }
    if (this.props.onScroll) {
      this.props.onScroll(event)
    }
  }

  onScrollBeginDrag = (event) => {
    // console.log('onScrollBeginDrag()');
    this._dragFlag = true
    const { refreshViewHeight } = this.props
    this._offsetY = event.nativeEvent.contentOffset.y - refreshViewHeight
    if (this.props.onScrollBeginDrag) {
      this.props.onScrollBeginDrag(event)
    }
  }

  onScrollEndDrag = (event) => {
    this._dragFlag = false
    const { y } = event.nativeEvent.contentOffset
    const { refreshViewHeight } = this.props
    this._offsetY = y - refreshViewHeight
    // console.log('onScrollEndDrag()' + y);
    if (!this._isRefreshing) {
      if (this.state.refreshStatus === RefreshStatus.releaseToRefresh) {
        this._isRefreshing = true
        this.setState({
          refreshStatus: RefreshStatus.refreshing,
          refreshTitle: this.props.refreshableTitleRefreshing
        })
        this._scrollview.scrollTo({ x: 0, y: 0, animated: true })
        if (this.props.insideOfUltimateListView) {
          this.props.onRefresh()
        } else {
          this.props.onRefresh(() => {
            this.onRefreshEnd()
          })
        }
      } else if (y <= refreshViewHeight) {
        this._scrollview.scrollTo({ x: 0, y: refreshViewHeight, animated: true })
      }
    } else if (y <= refreshViewHeight) {
      this._scrollview.scrollTo({ x: 0, y: 0, animated: true })
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
        showRefreshHeader: true
      })
      setTimeout(() => {
        if (this._scrollview.scrollTo) {
          this._scrollview.scrollTo({ x: 0, y: this.props.refreshViewHeight, animated: true })
        }
        this.setState({
          refreshStatus: RefreshStatus.pullToRefresh,
          refreshTitle: this.props.refreshableTitlePull,
          date: dateFormat(now, this.props.dateFormat)
        })
      }, 1000)

      AsyncStorage.setItem(DATE_KEY, now.toString())
      Animated.timing(this.state.arrowAngle, {
        toValue: 0,
        duration: 50,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start()
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
      <View
        style={[defaultHeaderStyles.header, this.props.refreshViewStyle, { height: this.props.refreshViewHeight }]}
      >
        <View style={defaultHeaderStyles.status}>
          {this.renderSpinner()}
          <Text style={defaultHeaderStyles.statusTitle}>{this.state.refreshTitle}</Text>
        </View>
        {this.props.displayDate &&
        <Text
          style={[defaultHeaderStyles.date, this.props.dateStyle]}
        >{this.props.dateTitle + this.state.date}
        </Text>
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
        contentContainerStyle={{ minHeight: height }}
        // onMomentumScrollEnd={this.onScrollEndDrag}
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
    width,
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
