import { handleActions, createAction } from 'redux-actions';
import itemsData from '../../../data/items.json';

// Actions
export const like = createAction('LIKE');
export const dislike = createAction('DISLIKE');
export const done = createAction('DONE');

const FETCH_REQUEST = 'item/FETCH_REQUEST';
const FETCH_RECEIVE = 'item/FETCH_RECEIVE';
const FETCH_FAILURE = 'item/FETCH_FAILURE';

async function wait(ttw = 500) {
  await new Promise(resolve => setTimeout(resolve, ttw));
}

export const fetchItems = () => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });

  try {
    await wait();
    dispatch({ type: FETCH_RECEIVE, items: itemsData });
  } catch (error) {
    dispatch({ type: FETCH_FAILURE, error });
  }
};

// State
const initialState = {
  items: [],
  loading: false,
  error: false,
};

// Reducers
export default handleActions(
  {
    [FETCH_REQUEST]: state => ({
      ...state,
      loading: true,
      error: false,
    }),
    [FETCH_RECEIVE]: (state, action) => ({
      ...state,
      items: action.items,
      loading: false,
      error: false,
    }),
    [FETCH_FAILURE]: (state, action) => ({
      ...state,
      items: [],
      loading: false,
      error: action.error,
    }),
    LIKE: (state, action) => ({
      ...state,
      items: state.items.map(item => (item.id === action.id ? { ...item, liked: true } : item)),
    }),
    DISLIKE: (state, action) => ({
      ...state,
      items: state.items.map(item => (item.id === action.id ? { ...item, liked: false } : item)),
    }),
    DONE: (state, action) => ({
      ...state,
      items: state.items.map(item => (item.id === action.id ? { ...item, skipped: true } : item)),
    }),
  },
  initialState,
);

export const getItems = ({ item }) => item.items;
