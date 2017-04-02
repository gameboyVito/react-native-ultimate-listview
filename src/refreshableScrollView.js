import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Animated,
    Easing,
    Dimensions,
    Image,
    AsyncStorage
} from "react-native";
import {dateFormat} from "./util";
const {width, height}=Dimensions.get('window');
const dateKey = 'ultimateRefreshDate';
const RefreshStatus = {
    pullToRefresh: 0,
    releaseToRefresh: 1,
    refreshing: 2
};

export default class RefreshableScrollView extends ScrollView {
    offsetY = 0;
    isRefreshing = false;
    dragFlag = false;

    constructor(props) {
        super(props);
        this.state = {
            arrowAngle: new Animated.Value(0),
            refreshStatus: RefreshStatus.pullToRefresh,
            refreshTitle: this.props.refreshableTitlePull,
            date: this.props.date
        };
    }

    endRefresh() {
        this.onRefreshEnd()
    }

    componentDidMount() {
        AsyncStorage.getItem(dateKey, (error, result) => {
            if (result) {
                result = parseInt(result);
                this.setState({
                    date: dateFormat(new Date(result), this.props.dateFormat),
                });
            }
        });
    }

    onScroll = (event) => {
        let y = event.nativeEvent.contentOffset.y;
        this.offsetY = y;
        if (this.dragFlag) {
            let height = this.props.customRefreshView ? this.props.customRefreshViewHeight : 70
            if (!this.isRefreshing) {
                if (y <= -height) {
                    this.setState({
                        refreshStatus: RefreshStatus.releaseToRefresh,
                        refreshTitle: this.props.refreshableTitleRelease
                    });
                    Animated.timing(this.state.arrowAngle, {
                        toValue: 1,
                        duration: 50,
                        easing: Easing.inOut(Easing.quad)
                    }).start();
                } else {
                    this.setState({
                        refreshStatus: RefreshStatus.pullToRefresh,
                        refreshTitle: this.props.refreshableTitlePull
                    });
                    Animated.timing(this.state.arrowAngle, {
                        toValue: 0,
                        duration: 100,
                        easing: Easing.inOut(Easing.quad)
                    }).start();
                }
            }

        }
        if (this.props.onScroll) {
            this.props.onScroll(event)
        }
    };

    onScrollBeginDrag = (event) => {
        //console.log('onScrollBeginDrag()');
        this.dragFlag = true;
        this.offsetY = event.nativeEvent.contentOffset.y;
        if (this.props.onScrollBeginDrag) {
            this.props.onScrollBeginDrag(event)
        }
    };

    onScrollEndDrag = (event) => {
        //console.log('onScrollEndDrag()');
        this.dragFlag = false;
        let y = event.nativeEvent.contentOffset.y;
        this.offsetY = y;
        let height = this.props.customRefreshView ? this.props.customRefreshViewHeight : 90;
        if (!this.isRefreshing) {
            if (this.state.refreshStatus == RefreshStatus.releaseToRefresh) {
                this.isRefreshing = true;
                this.setState({
                    refreshStatus: RefreshStatus.refreshing,
                    refreshTitle: this.props.refreshableTitleRefreshing
                });
                this.refs.scrollView.scrollTo({x: 0, y: -height, animated: true});
                this.props.onRefresh();
            }
        } else {
            if (y <= 0) {
                this.refs.scrollView.scrollTo({x: 0, y: -height, animated: true});
            }
        }
        if (this.props.onScrollEndDrag) {
            this.props.onScrollEndDrag(event)
        }
    };

    onRefreshEnd = () => {
        //console.log('onRefreshEnd()');
        if (this.state.refreshStatus === RefreshStatus.refreshing) {
            this.isRefreshing = false;
            let now = new Date().getTime();
            this.setState({
                refreshStatus: RefreshStatus.pullToRefresh,
                refreshTitle: this.props.refreshableTitlePull,
                date: dateFormat(now, this.props.dateFormat)
            });
            AsyncStorage.setItem(dateKey, now.toString());
            Animated.timing(this.state.arrowAngle, {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.quad)
            }).start();
            this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
        }
    };

    renderRefreshHeader() {
        if (this.props.customRefreshView) {
            return (
                <View style={{
                    position: 'absolute',
                    top: -this.props.customRefreshViewHeight + 5,
                    left: 0,
                    right: 0,
                    height: this.props.customRefreshViewHeight,
                }}>
                    {this.props.customRefreshView(this.state.refreshStatus, this.offsetY)}
                </View>
            );
        }

        return (
            <View style={defaultHeaderStyles.background}>
                <View style={defaultHeaderStyles.status}>
                    {this.renderSpinner()}
                    <Text style={defaultHeaderStyles.statusTitle}>{this.state.refreshTitle}</Text>
                </View>
                {this.props.displayDate &&
                <Text style={defaultHeaderStyles.date}>{this.props.dateTitle + this.state.date}</Text>
                }
            </View>
        );
    }

    renderSpinner() {
        if (this.state.refreshStatus == RefreshStatus.refreshing) {
            return (
                <ActivityIndicator style={{marginRight: 10}}/>
            )
        }
        return (
            <Animated.Image
                source={{uri: this.props.arrowImage}}
                resizeMode={'contain'}
                style={[defaultHeaderStyles.arrow,
                    {
                        transform: [{
                            rotateZ: this.state.arrowAngle.interpolate({
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
                onScrollEndDrag={this.onScrollEndDrag}
                onScrollBeginDrag={this.onScrollBeginDrag}>
                {this.renderRefreshHeader()}
                {this.props.children}
            </ScrollView>
        )
    }
}

const defaultHeaderStyles = StyleSheet.create({
    background: {
        alignItems: 'center',
        position: 'absolute',
        top: -85,
        left: 0,
        right: 0,
        height: 90,
        justifyContent: 'center',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrow: {
        width: 14,
        height: 23,
        marginRight: 10
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