import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    padding: 40,
  },
  text: {
    color: 'white',
  },
});

const propTypes = {
  idx: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
};

const defaultProps = {};

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImage: props.bgImage,
    };
  }

  renderImage = key => (
    <Image
      key={key}
      style={styles.bgImage}
      resizeMode="contain"
      source={{ uri: `${this.state.bgImage}/500x500?sig=${key}` }}
    />
  );

  render() {
    const { idx, title, description } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bgImageContainer}>{this.renderImage(idx)}</View>
        <View style={styles.content}>
          <Text style={styles.text}>Title: {title}</Text>
          <Text style={styles.text}>Description: {description}</Text>
        </View>
      </View>
    );
  }
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
