import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  indicatorText: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999999999,
    elevation: 5,
    backgroundColor: '#191514',
  },
  textTimer: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
