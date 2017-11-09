import React from 'react'
import { Platform, SegmentedControlIOS } from 'react-native'
import { Button, Text, View } from 'native-base'

export default (props) => {
  this.props = props

  if (Platform.OS === 'ios') {
    return (
      <SegmentedControlIOS
        style={{ flex: 0.7 }}
        values={['list', 'grid']}
        tintColor="#57a8f5"
        selectedIndex={this.props.layout === 'list' ? 0 : 1}
        onChange={this.props.onChangeLayout}
      />
    )
  }
  return (
    <View style={{
      flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    }}
    >
      <Button
        title="list"
        small
        light={this.props.layout !== 'list'}
        onPress={() => this.props.onChangeLayout({ nativeEvent: { selectedSegmentIndex: 0 } })}
        style={{
          width: 150,
          justifyContent: 'center',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5
        }}
      >
        <Text style={{ color: this.props.layout === 'list' ? 'white' : 'black' }}>List</Text>
      </Button>
      <Button
        title="grid"
        small
        light={this.props.layout !== 'grid'}
        onPress={() => this.props.onChangeLayout({ nativeEvent: { selectedSegmentIndex: 1 } })}
        style={{
          width: 150,
          justifyContent: 'center',
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5
        }}
      >
        <Text style={{ color: this.props.layout === 'grid' ? 'white' : 'black' }}>Grid</Text>
      </Button>
    </View>
  )
}
