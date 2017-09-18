import React from "react";
import {
    ActivityIndicator,
    Animated,
    AsyncStorage,
    Dimensions,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {dateFormat} from "./util";


const {width, height} = Dimensions.get('window');
const DATE_KEY = 'ultimateRefreshDate';
const RefreshStatus = {
    pullToRefresh: 0,
    releaseToRefresh: 1,
    refreshing: 2
};
const PaginationStatus = {
    firstLoad: 0,
    waiting: 1,
    allLoaded: 2
};

export default class RefreshableScrollView extends ScrollView {
    _offsetY = 0;
    _isRefreshing = false;
    _dragFlag = false;

    constructor(props) {
        super(props);
        this.state = {
            arrowAngle: new Animated.Value(0),
            refreshStatus: RefreshStatus.refreshing,
            refreshTitle: this.props.refreshableTitleRefreshing,
            date: this.props.date,
            showRefreshHeader: false
        };
    }

    componentDidMount() {
        console.warn('The advancedRefreshView is not ready for Android at this moment. \n\nIf the items are less than the height of device screen, the refreshView will not disappear. \n\nPlease consider setting the refreshableMode={Platform.OS === "ios" ? "advanced" : "basic"}, or feel free to send me a PR to resolve this problem. \n\nThanks a lot.');
        AsyncStorage.getItem(DATE_KEY, (error, result) => {
            if (result) {
                result = parseInt(result);
                this.setState({
                    date: dateFormat(new Date(result), this.props.dateFormat),
                });
            } else {
                this.setState({
                    date: dateFormat(new Date(), this.props.dateFormat),
                });
            }
        });
    }

    onScroll = (event) => {
        //console.log('onScroll()');
        const y = event.nativeEvent.contentOffset.y;
        const height = this.props.refreshViewHeight;
        if (y <= height) {
            this._offsetY = y - height;
        }
        if (this._dragFlag) {
            if (!this._isRefreshing) {
                if (y <= 10) {
                    if (this.state.refreshStatus !== RefreshStatus.releaseToRefresh) {
                        this.setState({
                            refreshStatus: RefreshStatus.releaseToRefresh,
                            refreshTitle: this.props.refreshableTitleRelease
                        });
                        Animated.timing(this.state.arrowAngle, {
                            toValue: 1,
                            duration: 50,
                            easing: Easing.inOut(Easing.quad)
                        }).start();
                    }
                } else {
                    if (this.state.refreshStatus !== RefreshStatus.pullToRefresh) {
                        this.setState({
                            refreshStatus: RefreshStatus.pullToRefresh,
                            refreshTitle: this.props.refreshableTitlePull
                        });
                        Animated.timing(this.state.arrowAngle, {
                            toValue: 0,
                            duration: 50,
                            easing: Easing.inOut(Easing.quad)
                        }).start();
                    }
                }
            }
        } else {
            //console.log('onScroll()' + y)
            if (y <= 5) {
                setTimeout(() => this.refs.scrollView.scrollTo({x: 0, y: height, animated: false}), 100);
            }
        }
        if (this.props.onScroll) {
            this.props.onScroll(event)
        }
    };

    onScrollBeginDrag = (event) => {
        //console.log('onScrollBeginDrag()');
        this._dragFlag = true;
        const height = this.props.refreshViewHeight;
        this._offsetY = event.nativeEvent.contentOffset.y - height;
        if (this.props.onScrollBeginDrag) {
            this.props.onScrollBeginDrag(event)
        }
    };

    onScrollEndDrag = (event) => {
        this._dragFlag = false;
        const y = event.nativeEvent.contentOffset.y;
        const height = this.props.refreshViewHeight;
        this._offsetY = y - height;
        //console.log('onScrollEndDrag()' + y);
        if (!this._isRefreshing) {
            if (this.state.refreshStatus === RefreshStatus.releaseToRefresh) {
                this._isRefreshing = true;
                this.setState({
                    refreshStatus: RefreshStatus.refreshing,
                    refreshTitle: this.props.refreshableTitleRefreshing
                });
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                this.props.onRefresh();
            } else {
                if (y <= height) {
                    this.refs.scrollView.scrollTo({x: 0, y: height, animated: true});
                }
            }
        } else {
            if (y <= height) {
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
            }
        }
        if (this.props.onScrollEndDrag) {
            this.props.onScrollEndDrag(event)
        }
    };

    scrollTo = (option) => {
        this.refs.scrollView.scrollTo(option);
    };

    scrollToEnd = (option) => {
        this.refs.scrollView.scrollToEnd(option);
    };

    onRefreshEnd = () => {
        //console.log('onRefreshEnd()');
        if (this.state.refreshStatus === RefreshStatus.refreshing) {
            this._isRefreshing = false;
            const now = new Date().getTime();
            this.setState({
                showRefreshHeader: true,
            });
            setTimeout(() => {
                if (this.refs.scrollView.scrollTo) {
                    this.refs.scrollView.scrollTo({x: 0, y: this.props.refreshViewHeight, animated: true});
                }
                this.setState({
                    refreshStatus: RefreshStatus.pullToRefresh,
                    refreshTitle: this.props.refreshableTitlePull,
                    date: dateFormat(now, this.props.dateFormat)
                });
            }, 1000);

            AsyncStorage.setItem(DATE_KEY, now.toString());
            Animated.timing(this.state.arrowAngle, {
                toValue: 0,
                duration: 50,
                easing: Easing.inOut(Easing.quad)
            }).start();
        }
    };

    renderRefreshHeader() {
        if (this.props.customRefreshView) {
            return (
                <View style={[defaultHeaderStyles.header, this.props.refreshViewStyle]}>
                    {this.props.customRefreshView(this.state.refreshStatus, this._offsetY)}
                </View>
            );
        }

        return (
            <View style={[defaultHeaderStyles.header, this.props.refreshViewStyle, {height: this.state.showRefreshHeader ? this.props.refreshViewHeight : 0}]}>
                <View style={defaultHeaderStyles.status}>
                    {this.renderSpinner()}
                    <Text style={defaultHeaderStyles.statusTitle}>{this.state.refreshTitle}</Text>
                </View>
                {this.props.displayDate &&
                <Text
                    style={[defaultHeaderStyles.date, this.props.dateStyle]}>{this.props.dateTitle + this.state.date}</Text>
                }
            </View>
        );
    }

    renderSpinner() {
        if (this.state.refreshStatus === RefreshStatus.refreshing) {
            return (
                <ActivityIndicator style={{marginRight: 10}}/>
            )
        }
        return (
            <Animated.Image
                source={this.props.arrowImageSource}
                resizeMode={'contain'}
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
                ref="scrollView"
                {...this.props}
                scrollEventThrottle={16}
                onScroll={this.onScroll}
                //contentContainerStyle={{paddingBottom: 80}}
                //onMomentumScrollEnd={this.onScrollEndDrag}
                onScrollEndDrag={this.onScrollEndDrag}
                onScrollBeginDrag={this.onScrollBeginDrag}>
                {this.renderRefreshHeader()}
                {this.props.children}
            </ScrollView>
        )
    }
}

const defaultHeaderStyles = StyleSheet.create({
    header: {
        width: width,
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
});