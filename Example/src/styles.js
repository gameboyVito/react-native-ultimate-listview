import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export default {
  container: {
    flex: 1
  },
  header: {
    width,
    height: 80,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'lightgray',
    backgroundColor: 'whitesmoke'
  },
  headerSegment: {
    width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  row: {
    flex: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 0 },
    marginLeft: -1,
    marginRight: -1,
    marginTop: 0,
    marginBottom: 0,
    padding: 0
  },
  rowAndroid: {
    flex: 0,
    borderColor: 'gray',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    marginLeft: -1,
    marginRight: -1,
    marginTop: 0,
    marginBottom: 0,
    padding: 0
  },
  rowHeader: {

  },
  rowBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: height * 0.25,
    marginBottom: 0,
    backgroundColor: 'whitesmoke'
  },
  image: {
    flex: 1,
    height: height * 0.25,
    marginBottom: 0,
    resizeMode: 'cover',
    backgroundColor: 'whitesmoke'
  },
  rowFooter: {
    padding: 0
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  gridThumb: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14
  },
  cardSubTitle: {
    marginTop: 3,
    fontSize: 11
  },
  rightBtnGroup: {
    flexDirection: 'row',
    width: width * 0.3
  },
  rightBtn: {
    margin: 0,
    padding: 5
  },
  rightBtnIcon: {
    color: 'dimgray'
  },
  gridText: {
    textAlign: 'center'
  },
  gridBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 3 - 10,
    height: width / 3 - 10,
    borderWidth: 0.5,
    borderColor: 'gray'
  }
}
