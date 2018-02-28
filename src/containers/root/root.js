import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SafeAreaView from 'react-native-safe-area-view';
import { fetchItems, getItems } from '../../redux/modules/item';
import Cards from '../../components/cards';

import styles from './styles';

const cardPropTypes = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
});

const mapStateToProps = state => ({
  items: getItems(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ fetchItems }, dispatch);

class Root extends Component {
  static propTypes = {
    fetchItems: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(cardPropTypes),
  };
  static defaultProps = {
    items: [],
  };

  componentDidMount() {
    this.props.fetchItems();
  }

  renderCard = card => (
    <View style={styles.card}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Image style={styles.cardBgImage} resizeMode="contain" source={{ uri: card.image }} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>Title: {card.title}</Text>
        <Text style={styles.cardText}>Description: {card.description}</Text>
      </View>
    </View>
  );

  render() {
    const { items } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Cards data={items} renderCard={this.renderCard} />
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
