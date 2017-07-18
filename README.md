# React Native Ultimate Listview

A high performance **FlatList** providing **customised pull-to-refresh** | **auto-pagination & infinite-scrolling** | **gridview layout** | **swipeable-row**. The truly ultimate version that I have done the most tricky part for you, just simply follow the instructions shown below to put it in your app.

This is an **enhanced FlatList** with all excellent extra features, comparing to the official version.

*This module supports both of **iOS** and **Android** platforms.*

*All codes are written in **ES6 syntax**.* 



**Quick installation**

- If on react-native < 0.43: `yarn add react-native-ultimate-listview@3.0.2`
- If on react-native >= 0.43 `yarn add react-native-ultimate-listview@3.1.6`



# Demo

|              | iOS                                      | Android                                  |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| **FlatList** | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/ios.gif) | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/android.gif) |



# Why FlatList

I have found some artical to explain why you need to use FlatList, instead of the legacy ListView. There are some obvious reasons:

1. FlatList just like the **UITableView** or **RecylerView**, which can dramatically reduce memory usage. It also provides more soomth animation when you have an extremely long list.
2. FlatList supports scrollToIndex function, which is pretty convenient when you want to scroll to an item with index, instead of depending the y-offset.
3. FlatList recommend developer to use PureComponent to reduce unnessary re-rendering, this can really boost the performance and make your app run faster.

* [Chinese article](https://segmentfault.com/a/1190000008589705) 
* [Official article](https://facebook.github.io/react-native/blog/2017/03/13/better-list-views.html) 




# Documentation

* [Overview](https://github.com/gameboyVito/react-native-ultimate-listview/wiki)
* [FlatList Migration](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/FlatList-Migration)
* [Usage](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Usage)
* [ListView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/ListView-API)
* [RefreshView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/RefreshView-API)
* [Pagination API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Pagination-API)
* [Methods API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Methods-API)
* [Swipable Tip](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Swipable-Row)




# Breaking Changes

- [ChangeLog](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/ChangeLog)
- See the **Release Note**


# Contribution

@gameboyVito - gameboyvito@gmail.com

​

# License

MIT