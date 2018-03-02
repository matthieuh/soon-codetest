import React from 'react';
import { PropTypes } from 'prop-types';
import { TouchableOpacity, Image, ViewPropTypes } from 'react-native';

import getStyles from './styles';

const propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]),
  style: ViewPropTypes.style,
  small: PropTypes.bool,
};
const defaultProps = {
  style: null,
  small: false,
  icon: null,
};

function CircleButton({
  icon, style, small, ...rest
}) {
  const styles = getStyles(small);
  return (
    <TouchableOpacity style={[styles.container, style]} {...rest}>
      <Image style={styles.icon} resizeMode="center" source={icon} />
    </TouchableOpacity>
  );
}

CircleButton.propTypes = propTypes;
CircleButton.defaultProps = defaultProps;

export default CircleButton;
