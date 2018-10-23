# React Native Ultimate Listview

This Library includes **two** components: `UltimateListView` and `UltimateRefreshView`

- **UltimateListView**: A high performance **FlatList** providing customised pull-to-refresh | auto-pagination & infinite-scrolling | gridview layout | swipeable-row. The truly ultimate version that I have done the most tricky part for you, you can treat this module as an **enhanced FlatList** with all excellently extra features, comparing to the official version.
- **UltimateRefreshView**: A refreshable **ScrollView** providing customised pull-to-refresh feature, which has already been using in the UltimateListView, but it can be used independently.



This module supports both of **iOS** and **Android** platforms.

All codes are written in **ES6 syntax**, and meet most rules of **Eslint** syntax



**Quick installation**

- If on react-native < 0.43: `yarn add react-native-ultimate-listview@3.0.2`
- If on react-native >= 0.43 `yarn add react-native-ultimate-listview@latest`




**Know Issue** (v3.3.0): On Android, if you are using CustomRefreshView, and the total hight of your first load data is less than your device height, then the RefreshView may still sticky on the top. However, if the data you loaded is beyond your screen, everything's fine. This issue only happen on Android, any PR is welcome.



# Demo

|              | iOS                                      | Android                                  |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| **FlatList** | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/ios.gif) | ![](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/Demo/android.gif) |



# Usage

```
import { UltimateListView, UltimateRefreshView } from 'react-native-ultimate-listview'
    <UltimateRefreshView onRefresh={this.onRefresh}>
         <YourView/>
    </UltimateRefreshView>

    <UltimateListView
       ref={ref => this.listView = ref}
       key={this.state.layout}
       onFetch={this.onFetch}
       keyExtractor={(item, index) => `${index} - ${item}`} 
       refreshableMode="advanced" // basic or advanced
       item={this.renderItem} // this takes three params (item, index, separator)       
       displayDate
       arrowImageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}/>
```
Or you can look through this link: [Usage](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Usage)



# Documentation

- [Overview](https://github.com/gameboyVito/react-native-ultimate-listview/wiki)
- [FlatList Migration](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/FlatList-Migration)
- [Usage](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Usage)
- [ListView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/ListView-API)
- [RefreshView API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/RefreshView-API) - most props are supported in <UltimateRefreshView />
- [Pagination API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Pagination-API)
- [Methods API](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Methods-API)
- [Swipable Tip](https://github.com/gameboyVito/react-native-ultimate-listview/wiki/Swipable-Row)



# Breaking Changes

- Provide a new Component <UltimateRefreshView />, which extends <ScrollView />

- Change import syntax to: 

  `import { UltimateListView, UltimateRefreshView } from 'react-native-ultimate-listview'`



# Contribution

@gameboyVito - gameboyvito@gmail.com

1. Fork this Repository, then run `yarn` or `npm install` in the root folder
2. After modifying the code, in the root folder, run `yarn eslint-fix` or `npm run eslint-fix`
3. Make sure your code satisfy the eslint rules, then commit and push your code
4. Open your Github, create a pull request to me. I will review it ASAP, thanks a lot.



# Why FlatList

I have found some articles to explain why you need to use FlatList instead of the legacy ListView. There are some obvious reasons:

1. FlatList is just like the **UICollectionView** or **RecyclerView**, which can dramatically reduce memory usage. It also provides smoother animation when you have an extremely long list.
2. FlatList supports scrollToIndex function, which is pretty convenient when you want to scroll to an item with index, instead of depending the y-offset.
3. FlatList recommend developer to use PureComponent to reduce unnecessary re-rendering, this can really boost the performance and make your app run faster.

* [Chinese article](https://segmentfault.com/a/1190000008589705) 
* [Official article](https://facebook.github.io/react-native/blog/2017/03/13/better-list-views.html) 





# License

MIT
