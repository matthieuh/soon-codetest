// inspiration:
// https://github.com/GeekyAnts/NativeBase/blob/5fa8e12869e2109f08220071e78b9a6f91874c5d/src/basic/DeckSwiper.js
// With some simplifications around gestures and fixing image flickering

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

import styles from './styles';

const { height, width } = Dimensions.get('window');

class Cards extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    renderCard: PropTypes.func.isRequired,
    onSwipeLeft: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipe: PropTypes.func,
  };
  static defaultProps = {
    data: [],
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    onSwipe: () => {},
  };

  static getSwipeDirection(animatedValueX = 0) {
    const limit = width / 4;
    const isSwipingLeft = animatedValueX < -limit;
    const isSwipingRight = animatedValueX > limit;

    return {
      isSwipingLeft,
      isSwipingRight,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      currentCard: 0,
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(0.97),
      enter: new Animated.Value(0.8),
      fadeAnim: new Animated.Value(0.8),
      panResponderLocked: false,
    };
  }

  componentWillMount() {
    this.animatedValueX = 0;
    this.animatedValueY = 0;

    this.state.pan.x.addListener(value => (this.animatedValueX = value.value));
    this.state.pan.y.addListener(value => (this.animatedValueY = value.value));

    this.initializePanResponder();
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  }

  onPanResponderGrant = () => {
    if (!this.state.panResponderLocked) {
      this.state.pan.setOffset({
        x: this.animatedValueX,
        y: this.animatedValueY,
      });
    }

    this.state.pan.setValue({
      x: 0,
      y: 0,
    });
  };

  onPanResponderMove = (event, gestureState) =>
    Animated.event([null, this.createAnimatedEvent()])(event, gestureState);

  onPanResponderRelease = () => {
    if (this.state.panResponderLocked) {
      this.state.pan.setValue({
        x: 0,
        y: 0,
      });
      this.state.pan.setOffset({
        x: 0,
        y: 0,
      });

      return;
    }

    const animatedValueX = Math.abs(this.animatedValueX);
    const animatedValueY = Math.abs(this.animatedValueY);

    const isSwiping = animatedValueX > width / 4 || animatedValueY > height / 5;

    if (isSwiping && this.validPanResponderRelease()) {
      const onSwipeDirectionCallback = this.getOnSwipeDirectionCallback(this.animatedValueX);
      this.setState({ panResponderLocked: true }, () => {
        this.swipeCard(onSwipeDirectionCallback);
        this.zoomNextCard();
      });
    } else {
      this.resetTopCard();
    }
  };

  onSwipeCallbacks = (swipeDirectionCallback, newCard) => {
    this.props.onSwipe(newCard);
    swipeDirectionCallback(newCard);
  };

  setNextCard = (newCard) => {
    this.setState(
      {
        currentCard: newCard,
        panResponderLocked: false,
      },
      this.resetPanAndScale,
    );
  };

  setCardSize = ({ nativeEvent }) => {
    const { width: cardSize } = nativeEvent.layout;
    this.setState({ cardSize });
  };

  getOnSwipeDirectionCallback = (animatedValueX) => {
    const { onSwipeLeft, onSwipeRight } = this.props;
    const { isSwipingLeft, isSwipingRight } = Cards.getSwipeDirection(animatedValueX);

    if (isSwipingRight) {
      return onSwipeRight;
    }

    if (isSwipingLeft) {
      return onSwipeLeft;
    }
  };

  jumpToCard = (newCard) => {
    if (this.props.data[newCard]) {
      this.setNextCard(newCard, false);
    }
  };

  incrementCardIndex = (onSwipe) => {
    const { currentCard } = this.state;
    let newCard = currentCard + 1;

    if (newCard === this.props.data.length) {
      newCard = 0;
    }

    this.onSwipeCallbacks(onSwipe, newCard);
    this.setNextCard(newCard);
  };

  swipeLeft = (mustDecrementCardIndex = false) => {
    this.zoomNextCard();

    this.swipeCard(this.props.onSwipeLeft, -width / 4, 0, mustDecrementCardIndex);
  };

  swipeRight = (mustDecrementCardIndex = false) => {
    this.zoomNextCard();

    this.swipeCard(this.props.onSwipeRight, width / 4, 0, mustDecrementCardIndex);
  };

  swipeCard = (
    onSwipe,
    x = this.animatedValueX,
    y = this.animatedValueY,
    mustDecrementCardIndex = false,
  ) => {
    Animated.timing(this.state.pan, {
      toValue: {
        x: x * 4.5,
        y: y * 4.5,
      },
      duration: 350,
    }).start(() => {
      mustDecrementCardIndex ? this.decrementCardIndex(onSwipe) : this.incrementCardIndex(onSwipe);
    });
  };

  resetTopCard = (cb) => {
    Animated.spring(this.state.pan, {
      toValue: 0,
    }).start(cb);

    this.state.pan.setOffset({
      x: 0,
      y: 0,
    });
  };

  validPanResponderRelease = () => {
    const { isSwipingLeft, isSwipingRight } = Cards.getSwipeDirection(
      this.animatedValueX,
      this.animatedValueY,
    );

    return isSwipingLeft || isSwipingRight;
  };

  resetPanAndScale = () => {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.scale.setValue(0.97);
  };

  zoomNextCard = () => {
    Animated.spring(this.state.scale, {
      toValue: 1,
      friction: 7,
      duration: 100,
    }).start();
  };

  createAnimatedEvent = () => {
    const { x } = this.state.pan;
    return { dx: x, dy: 0 };
  };

  initializePanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isVerticalSwipe = Math.sqrt(gestureState.dx ** 2 < gestureState.dy ** 2);
        if (isVerticalSwipe) {
          return false;
        }
        return Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2) > 10;
      },
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  };

  resetState() {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter.setValue(0.8);
    this.state.fadeAnim.setValue(0.8);
  }

  interpolateRotation = () =>
    this.state.pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
    });

  calculateSwipableCardStyle = () => {
    const opacity = this.props.animateCardOpacity ? this.interpolateCardOpacity() : 1;
    const rotation = this.interpolateRotation();

    return [
      styles.card,
      {
        zIndex: 3,
        opacity,
        transform: [
          { translateX: this.state.pan.x },
          { translateY: this.state.pan.y },
          { rotate: rotation },
        ],
      },
    ];
  };

  renderMainCard() {
    const { data, renderCard, style } = this.props;
    const { currentCard } = this.state;

    const index = currentCard;
    const cardContent = data[index];
    const card = renderCard({ index, data: cardContent });

    return (
      <Animated.View
        key={index}
        style={[styles.card, style, this.calculateSwipableCardStyle()]}
        {...this.panResponder.panHandlers}
      >
        {card}
      </Animated.View>
    );
  }

  renderNextCard() {
    const { data, renderCard, style } = this.props;
    const { currentCard, fadeAnim } = this.state;

    const index = currentCard + 1;
    const cardContent = data[index];
    const card = renderCard({ index, data: cardContent });

    return (
      <Animated.View key={index} style={[styles.card, style, { opacity: fadeAnim, zIndex: 1 }]}>
        {card}
      </Animated.View>
    );
  }

  render() {
    const { data, renderCard, ...rest } = this.props;

    return (
      <View
        onLayout={this.setCardSize}
        style={[styles.container, { height: this.state.cardSize }]}
        {...rest}
      >
        {data.length > 0 && (
          <View style={{ flex: 1 }}>
            {this.renderNextCard()}
            {this.renderMainCard()}
          </View>
        )}
      </View>
    );
  }
}

export default Cards;
