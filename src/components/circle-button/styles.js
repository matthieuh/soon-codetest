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
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
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
