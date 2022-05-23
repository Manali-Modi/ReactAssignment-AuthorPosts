import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  card:{
    borderRadius:12,
    elevation:5,
    padding:8,
    marginHorizontal:8,
    marginVertical:4
  },
  horizontal_view:{
    flexDirection: 'row'
  },
  title_text:{
    width:'85%',
    fontSize:18,
    color: colors.primary,
    fontWeight: 'bold'
  },
  toggle:{
    alignSelf:'flex-start'
  },
  author_text:{
    color: colors.primary_light,
    marginTop:8,
    marginEnd:4,
    fontWeight: 'bold'
  },
  date_text:{
    alignSelf:'flex-end',
    fontSize: 12,
    color: colors.primary_dark
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    margin:4
  }
})