# react-native-ultimate-listview

An RN ListView providing pull-to-refresh | auto-pagination | infinite-scrolling | and grid-view layout. The truly ultimate version decorated by fancy UI. You can use it conveniently without any extra code, I have done the most tricky part for you.



# Installation

```
npm install react-native-ultimate-listview --save
```



# Example

There is an example in the `/Example` folder for your further reference. It's also a pretty nite starter project, if you are new to React-Native.

```
cd react-native-ultimate-listview/Example
npm install
react-native link
react-native run-ios (or react-native run-android)
```



# Usage

### Basic version:

```react
onFetch = async(page = 1, callback, options) => {
    try {
        //Simulate the network loading
        await this.sleep(2000);
        let skip = (page - 1) * 12;
        let rowData = ['Friend ' + (skip),'Friend ' + (skip + 1),'Friend ' + (skip + 2),'Friend ' + (skip + 3),'Friend ' + (skip + 4),'Friend ' + (skip + 5),'Friend ' + (skip + 6),'Friend ' + (skip + 7),'Friend ' + (skip + 8),'Friend ' + (skip + 9),'Friend ' + (skip + 10),'Friend ' + (skip + 11)];
        //Simulate the end of the list
        if (page === 5) {
            rowData = [];
        }
        callback(rowData);
    } catch (err) {
        console.log(err);
    }
};
```

- List-view layout:

  ```react
  import UltimateListView from "react-native-ultimate-listview";

  <UltimateListView
  	enableEmptySections
      separator={true}
      onFetch={this.onFetch}
      rowView={this.renderRowView}
  />
  ```

- Grid-view layout:

  ```react
  import UltimateListView from "react-native-ultimate-listview";

  <UltimateListView
  	enableEmptySections
  	gridView
  	gridColumn={2}
      onFetch={this.onFetch}     
      rowView={this.renderRowView}
  />
  ```



### Advanced Version

Please read my code in the `/Example` folder.



# API

### Custom View

| Prop                    | Default | Type | Description                              |
| ----------------------- | ------- | ---- | ---------------------------------------- |
| headerView              | null    | func | This is the header of the listview, which is always shown at the top of the list |
| rowView                 | null    | func | This is the row content of the listview, which will be rendered row by row |
| sectionHeaderView       | null    | func | If provided, a header is rendered for this section. |
| paginationFetchingView  | null    | func | This view will be displayed when you are fetching the data from the server at the first time |
| paginationAllLoadedView | null    | func | This view will be displayed, if there is no more rowView returned from the server. It means the list has been loaded completely |
| paginationWaitingView   | null    | func | This view will be displayed when you are loading more data from the server. It should be the FooterView of the ListView. Defaultly, it will show a loading spinner |
| emptyView               | null    | func | If there is no data while you are trying to fetch data from the server at the first time, this view will be displayed |
| separator               | null    | any  | true, false, func. You can set it to *true* to display the separator in the default style, or *false* to hide the separator. And, you can customise it by passing your own View Component |



### RefreshControl

| Props                              | Default                                 | Type   | Description                              |
| ---------------------------------- | --------------------------------------- | ------ | ---------------------------------------- |
| refreshable                        | true                                    | bool   | Set it to true to enable the RefreshControl component |
| refreshableColors                  | ['lightskyblue', 'tomato', 'limegreen'] | array  | android only                             |
| refreshableProgressBackgroundColor | 'white'                                 | string | android only                             |
| refreshableSize                    | undefined                               | string | "small" or "large"                       |
| refreshableTitle                   | 'Pull To Refresh'                       | string | The hint text when you are triggering the refresh event |
| refreshableTintColor               | 'lightgray'                             | string | ios only                                 |
| renderRefreshControl               | null                                    | func   | Customize your own View of the RefreshControl |



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

| Props      | Default | Type   | Desctiption                              |
| ---------- | ------- | ------ | ---------------------------------------- |
| gridView   | false   | bool   | If you are using gridView mode, please make sure you set the separator props to false |
| gridColumn | 2       | number | If you are using gridView mode, please make sure the length of fetching array must be a multiple of the gridColumn |



# Contribution

- @gameboyVito