# react-native-ultimate-listview

An RN ListView providing pull-to-refresh | auto-pagination | infinite-scrolling | and grid-view layout. The truly ultimate version decorated by fancy UI. You can use it conveniently without any extra code, I have done the most tricky part for you.



# Installation

```
npm install react-native-ultimate-listview --save
```



# Example

There is an example in the `/Example` folder for your further reference. It's also a pretty nite starter project, if you are new to React-Native.

```
git clone 
cd react-native-ultimate-listview/Example
npm install
react-native link
react-native run-ios (or react-native run-android)
```



# Usage

### Basic version:

```react
sleep = (time) => {
    return new Promise(function (resolve, reject) {
            setTimeout(function () {resolve()}, time);
        })
    };
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
  <UltimateListView
  	enableEmptySections
      separator={true}
      onFetch={this.onFetch}
      rowView={this.renderRowView}
  />
  ```

- Grid-view layout:

  ```react
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

| Prop                    | Default | Type | Description |
| ----------------------- | ------- | ---- | ----------- |
| headerView              | null    | func |             |
| rowView                 | null    | func |             |
| sectionHeaderView       | null    | func |             |
| paginationFetchingView  | null    | func |             |
| paginationAllLoadedView | null    | func |             |
| paginationWaitingView   | null    | func |             |
| emptyView               | null    | func |             |
| separator               | null    | func |             |



### RefreshControl

| Props                              | Default                                 | Type   | Description |
| ---------------------------------- | --------------------------------------- | ------ | ----------- |
| refreshable                        | true                                    | bool   |             |
| refreshableColors                  | ['lightskyblue', 'tomato', 'limegreen'] | array  |             |
| refreshableProgressBackgroundColor | 'white'                                 | string |             |
| refreshableSize                    | undefined                               | string |             |
| refreshableTitle                   | 'Pull To Refresh'                       | string |             |
| refreshableTintColor               | 'lightgray'                             | string |             |
| renderRefreshControl               | null                                    | func   |             |



### Pagination

| Props                 | Default        | Type   | Description |
| --------------------- | -------------- | ------ | ----------- |
| autoPagination        | true           | bool   |             |
| onEndReachedThreshold | 50             | number |             |
| allLoadedText         | 'The End'      | string |             |
| spinnerColor          | 'gray'         | string |             |
| fetchingSpinnerSize   | 'large'        | string |             |
| waitingSpinnerSize    | 'small'        | string |             |
| waitingSpinnerText    | 'Loading...'   | string |             |
| paginationBtnText     | 'Load more...' | string |             |



### Grid View

| Props      | Default | Type   | Desctiption                              |
| ---------- | ------- | ------ | ---------------------------------------- |
| gridView   | false   | bool   | If you are using gridView mode, please make sure you set the separator props to false |
| gridColumn | 2       | number | If you are using gridView mode, please make sure the length of fetching array must be a multiple of the gridColumn |



# Contribution

- @gameboyVito