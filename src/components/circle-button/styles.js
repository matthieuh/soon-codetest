import { StyleSheet } from 'react-native';

const getStyles = (isSmall) => {
  const coef = isSmall ? 0.85 : 1;
  const SIZE = 84 * coef;
  const ICON_SIZE = SIZE * 0.5;

  return StyleSheet.create({
    container: {
      height: SIZE,
      width: SIZE,
      borderRadius: SIZE / 2,
      shadowColor: '#6F6F6F',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      height: ICON_SIZE,
      width: ICON_SIZE,
    },
  });
};

export default getStyles;
