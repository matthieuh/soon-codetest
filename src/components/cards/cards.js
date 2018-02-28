// inspiration:
// https://github.com/GeekyAnts/NativeBase/blob/5fa8e12869e2109f08220071e78b9a6f91874c5d/src/basic/DeckSwiper.js
// and https://github.com/alexbrillant/react-native-deck-swiper/blob/master/Swiper.js
// With some simplifications around gestures

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

import styles from './styles';

const { height, width } = Dimensions.get('window');

const SWIPE_THRESHOLD = 80;

class Cards extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    renderCard: PropTypes.func.isRequired,
  };
  static defaultProps = {
    data: [],
  };

  static getSwipeDirection(animatedValueX, animatedValueY) {
    const isSwipingLeft = animatedValueX < -width / 4;
    const isSwipingRight = animatedValueX > width / 4;
    const isSwipingTop = animatedValueY < -(height / 5);
    const isSwipingBottom = animatedValueY > height / 5;

    return {
      isSwipingLeft,
      isSwipingRight,
      isSwipingTop,
      isSwipingBottom,
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
      this.setState({ panResponderLocked: true }, () => {
        this.swipeCard();
        this.zoomNextCard();
      });
    } else {
      this.resetTopCard();
    }
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

  incrementCardIndex = () => {
    const { currentCard } = this.state;
    let newCard = currentCard + 1;

    if (newCard === this.props.data.length) {
      newCard = 0;
    }

    this.setNextCard(newCard);
  };

  swipeCard = (x = this.animatedValueX, y = this.animatedValueY) => {
    Animated.timing(this.state.pan, {
      toValue: {
        x: x * 4.5,
        y: y * 4.5,
      },
      duration: 350,
    }).start(() => {
      this.incrementCardIndex();
    });
  };

  resetTopCard = (cb) => {
    console.log('resetTopCard');
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
    const { data, renderCard } = this.props;
    const { currentCard } = this.state;

    const cardData = data[currentCard];

    console.log('renderMainCard', cardData);

    return (
      <Animated.View
        style={[styles.card, this.calculateSwipableCardStyle()]}
        {...this.panResponder.panHandlers}
      >
        {renderCard(cardData)}
      </Animated.View>
    );
  }

  renderNextCard() {
    const { data, renderCard } = this.props;
    const { currentCard, fadeAnim } = this.state;

    const cardData = data[currentCard + 1];

    console.log('renderNextCard', cardData);

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim, zIndex: 1 }]}>
        {renderCard(cardData)}
      </Animated.View>
    );
  }

  render() {
    const { data, renderCard, ...rest } = this.props;

    return (
      <View style={styles.container} {...rest}>
        {data.length > 0 && (
          <View
            config={{
              velocityThreshold: 0.3,
              directionalOffsetThreshold: SWIPE_THRESHOLD,
            }}
          >
            {this.renderNextCard()}
            {this.renderMainCard()}
          </View>
        )}
      </View>
    );
  }
}

export default Cards;
