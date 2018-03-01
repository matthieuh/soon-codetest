import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
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
  done,
} from '../../redux/modules/item';

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
      done,
    },
    dispatch,
  );

class Root extends Component {
  static propTypes = {
    fetchItems: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(cardPropTypes),
    currentItem: PropTypes.number.isRequired,
  };
  static defaultProps = {
    items: [],
  };

  componentDidMount() {
    this.props.fetchItems();
  }

  action = actionType => () => this.props[actionType](this.props.currentItem);

  renderActions = () => (
    <View style={styles.actions}>
      <CircleButton icon={dislikeIcon} style={styles.action} onPress={this.action('dislike')} />
      <CircleButton icon={doneIcon} style={styles.action} small onPress={this.action('done')} />
      <CircleButton icon={likeIcon} style={styles.action} onPress={this.action('like')} />
    </View>
  );

  render() {
    const { items, currentItem } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.h1}>Explore</Text>
          <Cards
            data={items}
            onSwipe={this.props.setCurrentItem}
            onSwipeRight={() => this.action('done')}
            renderCard={({ data, index }) => (
              <Card
                idx={index}
                title={data.title}
                description={data.description}
                bgImage={data.image}
              />
            )}
          />
          {this.renderActions()}
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
