# react-native-ultimate-listview

An RN ListView providing **pull-to-refresh** | **auto-pagination** | **infinite-scrolling** | **grid-view layout** | **swipeable-row**. The truly ultimate version that I have done the most tricky part for you, just simply follow the instruction shown here to write your app.



All codes are written in **ES6 syntax**. 



# Demo

|         | ListView                                 | GridView                                 |
| ------- | ---------------------------------------- | ---------------------------------------- |
| iOS     | ![ios-listview](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/gif/ios-listview.gif) | ![ios-gridview](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/gif/ios-gridview.gif) |
| Android | ![android-listview](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/gif/android-listview.gif) | ![android-gridview](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/gif/android-gridview.gif) |



# Installation

1. First of all, install this module from NPM

   ```
   $ npm install react-native-ultimate-listview --save
   ```



2. Then, import it into your project.

   ```
   import UltimateListView from "react-native-ultimate-listview";
   ```




# Example

There is an example in the `/Example` folder for your further reference. It's also a pretty nite starter project, so feel free to git clone and use it as your brand-new project.

```shell
$ git clone https://github.com/gameboyVito/react-native-ultimate-listview.git
$ cd react-native-ultimate-listview/Example
$ npm install
$ react-native link
$ react-native run-ios
```



# Usage

### Basic version:

```react
import React, {Component} from "react";
import {StyleSheet, View, Alert, Text, TouchableOpacity} from "react-native";
import UltimateListView from "react-native-ultimate-listview";

export default class Example extends Component {

    sleep = (time) => {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    onFetch = async(page = 1, callback, options) => {
        try {
            //Simulate the network loading in ES7 syntax (async/await)
            await this.sleep(1000);
            const pageLimit = 24;
            let skip = (page - 1) * pageLimit;

            //Generate dummy data
            let rowData = Array.from({length: pageLimit}, (value, index) => index + skip);

            //Simulate the end of the list if no more data returned from the server
            if (page === 3) {
                rowData = [];
            }

            //This is important!!! to determinate if the first page is all loaded
            options.pageLimit = pageLimit;

            callback(rowData, options);
        } catch (err) {
            console.log(err);
        }
    };

    renderRowView = (rowData, sectionID, rowID) => {
        //write your own layout in list view
    };

    renderGridView = (rowData, sectionID, rowID) => {
        //write your own layout in grid view
    };

    onPress = (rowID, rowData) => {
        Alert.alert(rowID, `You're pressing on ${rowData}`);
    };

    render() {
        return (           
          <UltimateListView
            onFetch={this.onFetch}
            enableEmptySections

            //----Normal Mode----
            separator={true}
            rowView={this.renderRowView}

            //----GridView Mode----
            //gridView={true}
            //gridBorder={true}
            //gridColumn={3}
            //pageSize={3}
            //rowView={this.renderGridView}                 
            />
        );
    }
}
```



### Advanced version:

Please read my code in the `/Example` folder. => [App.js](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Example/js/App.js)



### Swipeable Tip:

If you want to use swipeable row in this listview, I highly recommend you to use [react-native-swipeout](https://github.com/dancormier/react-native-swipeout). To use it, simply put it into the `renderRowView()` method and wrap your own `<View/>` into `<Swipeout/>`  component. 

```
import Swipeout from "react-native-swipeout"
import {Text, View} from "react-native";

const swipeoutBtns = [
  {
    text: 'Button'
  }
]

<Swipeout right={swipeoutBtns}>
  <View>
    <Text>Swipe me</Text>
  </View>
</Swipeout>
```



# API

### Custom View

| Prop                    | Default | Type | Description                              |
| ----------------------- | ------- | ---- | ---------------------------------------- |
| headerView              | null    | func | This is the header of the listview, which is always shown at the top of the list |
| rowView                 | null    | func | This is the row content of the listview, which will be rendered row by row |
| sectionHeaderView       | null    | func | If provided, a header is rendered for this section. |
| paginationFetchingView  | null    | func | This view will be displayed when you are fetching the data from the server at the first time |
| paginationAllLoadedView | null    | func | This view will be displayed, if there is no more rowView returned from the server. It means the list has been loaded completely |
| paginationWaitingView   | null    | func | This view will be displayed when you are loading more data from the server. It should be the FooterView of the ListView. By default, it will show a loading spinner |
| emptyView               | null    | func | If there is no data while you are trying to fetch data from the server at the first time, this view will be displayed |
| separator               | null    | any  | true, false, func. You can set it to *true* to display the separator in the default style, or *false* to hide the separator. And, you can customise it by passing your own View Component |



### RefreshControl

| Props                              | Default                            | Type   | Description                              |
| ---------------------------------- | ---------------------------------- | ------ | ---------------------------------------- |
| refreshable                        | true                               | bool   | Set it to true to enable the RefreshControl component |
| refreshableColors                  | ['dimgray', 'tomato', 'limegreen'] | array  | android only                             |
| refreshableProgressBackgroundColor | 'white'                            | string | android only                             |
| refreshableSize                    | undefined                          | string | "small" or "large"                       |
| refreshableTitle                   | 'Pull To Refresh'                  | string | The hint text when you are triggering the refresh event |
| refreshableTintColor               | 'lightgray'                        | string | ios only                                 |
| renderRefreshControl               | null                               | func   | Customize your own View of the RefreshControl |



### Pagination

| Props                 | Default        | Type   | Description                              |
| --------------------- | -------------- | ------ | ---------------------------------------- |
| autoPagination        | true           | bool   | Set it to true to enable the auto pagination, if you want the feature of infinite-scrolling. |
| onEndReachedThreshold | 50             | number | Threshold in pixels (virtual, not physical) for calling onEndReached |
| allLoadedText         | 'The End'      | string | The text displayed in the  paginationAllLoadedView |
| spinnerColor          | 'gray'         | string | The color of the loading spinner in the Footer |
| fetchingSpinnerSize   | 'large'        | string | The size of the loading spinner in the paginationFetchingView |
| waitingSpinnerSize    | 'small'        | string | The size of the loading spinner in the paginationWaitingView |
| waitingSpinnerText    | 'Loading...'   | string | The text displayed in the paginationWaitingView, if the autoPagination is set to be true |
| paginationBtnText     | 'Load more...' | string | The text displayed in the paginationWaitingView, if the autoPagination is set to be false |



### Grid View

| Props      | Default | Type   | Description                              |
| ---------- | ------- | ------ | ---------------------------------------- |
| gridView   | false   | bool   | If you are using gridView mode, please make sure you set the separator props to false |
| gridColumn | 2       | number | If you are using gridView mode, please make sure the length of fetching array must be a multiple of the gridColumn |
| pageSize   | 1       | number | Number of rows to render per event loop. You should set this value as the same as the gridColumn, so that the listview can load the list row by row instead of item by item |
| gridBorder | true    | bool   | You can set it to false, if you want to customize your own border in your grid item. |



### Methods

| Name                      | Params        | Types         | Description                              |
| ------------------------- | ------------- | ------------- | ---------------------------------------- |
| getPage()                 | -             | -             | Get page                                 |
| setPage(page)             | page          | number        | Set page                                 |
| getRows()                 | -             | -             | Get the current DataSource               |
| setRows(rows)             | rows          | array         | Set the current DataSource               |
| refresh()                 | -             | -             | Refresh the whole list. By default, it will set the page to 1 and fetch data from server |
| stopRefresh()             | -             | -             | Stop the refreshing animation if timeout is triggered. Please noted, you need to call this method in your timeout catch block. |
| updateRows(rows, options) | rows, options | array, object | If you want to modify or update your DataSource, you can generate a  new array and pass it into this method. Then the ListView will be rerender automatically. Be careful, the options here is required: `options.external=true` |
| callback(data, options)   | data, options | array, object | The data array is the array you fetch from the server, while the options object can contain the following keys: pageLimit(number) \| allLoaded(boolean) \| external(boolean) |

​

# Contribution

gameboyVito

​

# License

MIT