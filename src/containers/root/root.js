import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SafeAreaView from 'react-native-safe-area-view';

import {
  fetchItems,
  getItems,
  getCurrentItem,
  setCurrentItem,
  like,
  dislike,
  setVisited,
} from '../../redux/modules/items';

import Cards from '../../components/cards';
import Card from '../../components/card';
import CircleButton from '../../components/circle-button';

import styles from './styles';
import dislikeIcon from '../../assets/dislike.png';
import doneIcon from '../../assets/done.png';
import likeIcon from '../../assets/like.png';

const cardPropTypes = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
});

const mapStateToProps = state => ({
  items: getItems(state),
  currentItem: getCurrentItem(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchItems,
      setCurrentItem,
      like,
      dislike,
      setVisited,
    },
    dispatch,
  );

class Root extends Component {
  static propTypes = {
    fetchItems: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(cardPropTypes),
    currentItem: PropTypes.number.isRequired,
    setCurrentItem: PropTypes.func.isRequired,
  };
  static defaultProps = {
    items: [],
  };

  componentDidMount() {
    this.props.fetchItems();
  }

  action = actionType => () =>
    this.props[actionType] && this.props[actionType](this.props.currentItem);

  handleActionButtonPress = actionType => async () => {
    await this.action(actionType)();
    switch (actionType) {
      case 'like':
      case 'setVisited':
        this.cardSwiper.swipeRight(true);
        break;
      case 'dislike':
        this.cardSwiper.swipeLeft(true);
        break;
      default:
        break;
    }
  };

  renderActions = () => (
    <View style={styles.actions}>
      <CircleButton
        icon={dislikeIcon}
        style={styles.action}
        onPress={this.handleActionButtonPress('dislike')}
      />
      <CircleButton
        icon={doneIcon}
        style={styles.action}
        onPress={this.handleActionButtonPress('setVisited')}
        small
      />
      <CircleButton
        icon={likeIcon}
        style={styles.action}
        onPress={this.handleActionButtonPress('like')}
      />
    </View>
  );

  render() {
    const { items } = this.props;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.h1}>Explore</Text>
          <View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginBottom: 10 }}
              onPress={() => this.cardSwiper.jumpToCard(0)}
            >
              <Text style={{ color: '#007AFF' }}>Back to first card</Text>
            </TouchableOpacity>
            <Cards
              ref={(cardSwiper) => {
                this.cardSwiper = cardSwiper;
              }}
              data={items}
              onSwipe={this.props.setCurrentItem}
              onSwipeLeft={this.action('setVisited')}
              onSwipeRight={this.action('setVisited')}
              renderCard={({ data, index }) => <Card idx={index} {...data} />}
            />
          </View>
          {this.renderActions()}
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
