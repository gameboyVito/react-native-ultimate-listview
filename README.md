# react-native-ultimate-listview

An RN ListView providing **pull-to-refresh** | **auto-pagination** | **infinite-scrolling** | and **grid-view layout**. The truly ultimate version decorated by fancy UI. You can use it conveniently without any extra code, I have done the most tricky part for you.



All codes are written in **ES6 syntax**. 



# Installation

```shell
$ npm install react-native-ultimate-listview --save
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
  	gridColumn={3}
      pageSize={3}
      onFetch={this.onFetch}     
      rowView={this.renderRowView}
  />
  ```


Please read my code in the `/Example` folder. => [App.js](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Example/js/App.js)



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
| pageSize   | 1       | number | Number of rows to render per event loop. You should set this value as the same as the gridColumn, so that the listview can load the list row by row instead of item by item |



# To-do-list

- Swipe-to-left

- Swipe-to-right

  ​

# Contribution

- @gameboyVito

  ​

# License

MIT