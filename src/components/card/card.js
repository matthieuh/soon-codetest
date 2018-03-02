import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    flex: 1,
    backgroundColor: '#FA5F5C',
    borderRadius: 20,
    shadowColor: '#6F6F6F',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    justifyContent: 'flex-end',
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  bgImage: {
    flex: 1,
  },
  content: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    color: 'white',
  },
});

const propTypes = {
  idx: PropTypes.number.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  status: PropTypes.string,
  visited: PropTypes.bool,
};

const defaultProps = {
  title: null,
  description: null,
  image: null,
  status: null,
  visited: null,
};

class Card extends Component {
  renderImage = key => (
    <FastImage
      key={key}
      style={styles.bgImage}
      resizeMode="contain"
      source={{ uri: `${this.props.image}/500x500?sig=${this.props.idx}` }}
    />
  );

  render() {
    const {
      idx, title, description, image, status, visited,
    } = this.props;
    return (
      <View style={styles.container}>
        {image && <View style={styles.bgImageContainer}>{this.renderImage(idx)}</View>}
        <View style={styles.content}>
          {title && <Text style={styles.text}>{title}</Text>}
          {description && <Text style={styles.text}>Description: {description}</Text>}
          {status && <Text style={styles.text}>Status: {status}</Text>}
          {!visited && <Text style={styles.text}>First date 🤗</Text>}
        </View>
      </View>
    );
  }
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
