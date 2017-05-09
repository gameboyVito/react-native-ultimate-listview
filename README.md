# React Native Ultimate Listview

An RN **FlatList / ListView** providing **customised pull-to-refresh** | **auto-pagination & infinite-scrolling** | **gridview layout** | **swipeable-row**. The truly ultimate version that I have done the most tricky part for you, just simply follow the instructions shown below to put it in your app.

*This module supports both of **iOS** and **Android** platforms.*

*All codes are written in **ES6 syntax**.* 



### What's new in the ^3.0.0 (Breaking Changes)

- Migrated to support **react-native 0.43** or above
- Supported both of **FlatList** and **ListView**
- FlatList brings **hight performance** and excellent **memory control**
- New props `legacyImplementation`,  `refreshableTitle` , `cellContainerStyle`, `rowContainerStyle`
- `renderRowView(item, index)` now takes a different callback with two params `item`, `index`
- In the FlatList, to use grid-view layout, only need to set `gridColumn` & `rowContainerStyle`
- In the ListView, only the `gridColumn` is required, and you can also set `cellContainerStyle`



### Tips:

- If you are using react-native <= 0.42, or you do not want to use FlatList in your app, just simply set this props: `legacyImplementation={true}` . Everything will be the same as before, you do not need to modify any codes at all.

- The FlatList has some kown issues, like blank screen if scrolling is too fast. See the office doc:

  > In order to constrain memory and enable smooth scrolling, content is rendered asynchronously offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see blank content. This is a tradeoff that can be adjusted to suit the needs of each application, and we are working on improving it behind the scenes.


- However, if you have a long list to display and suffer from the memory leaking,  I highly recommend you to use **FlatList** inseated of the poor perforamce ListView

- Since this release contains too many changes, if you are facing any bugs, please let me know

- Current stable version: **v2.0.9**

  ​

# Demo

| New     | iOS                                      | Android                                  |
| ------- | ---------------------------------------- | ---------------------------------------- |
| Refresh | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/ios-advanced.gif) | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/android-advanced.gif) |

| Basic   | ListView                                 | GridView                                 |
| ------- | ---------------------------------------- | ---------------------------------------- |
| iOS     | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/ios-listview.gif) | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/ios-gridview.gif) |
| Android | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/android-listview.gif) | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/android-gridview.gif) |



# Wiki

* [Overview](https://github.com/gameboyVito/react-native-ultimate-listview/wiki)
* [Installation](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Installation)
* [Upgrade](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Upgrade)
* [Usage](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Usage)
* [Swipable Row](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Swipable-Row)
* [ListView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/ListView-API)
* [GridView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/GridView-API)
* [RefreshView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/RefreshView-API)
* [Pagination API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Pagination-API)
* [Methods API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Methods-API)



# Contribution

gameboyVito

​

# License

MIT