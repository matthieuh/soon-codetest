import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
  },
  card: {
    elevation: 3,
    flex: 1,
    backgroundColor: '#FA5F5C',
    width: width - 80,
    height: width - 80,
    borderRadius: 40,
    // overflow: 'hidden',
    shadowColor: '#6F6F6F',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  cardBgImage: {
    flex: 1,
  },
  cardContent: {
    padding: 40,
  },
  cardText: {
    color: 'white',
  },
});

export default styles;
