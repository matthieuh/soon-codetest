import { handleActions, createAction } from 'redux-actions';
import itemsData from '../../../data/items.json';

// Simulate async HTTP call
async function wait(ttw = 500) {
  await new Promise(resolve => setTimeout(resolve, ttw));
}

// Actions
export const setCurrentItem = createAction('SET_CURRENT');
export const like = createAction('LIKE');
export const dislike = createAction('DISLIKE');
export const setVisited = createAction('SET_VISITED');

const FETCH_REQUEST = 'item/FETCH_REQUEST';
const FETCH_RECEIVE = 'item/FETCH_RECEIVE';
const FETCH_FAILURE = 'item/FETCH_FAILURE';

export const fetchItems = () => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });

  try {
    await wait();
    dispatch({ type: FETCH_RECEIVE, data: itemsData });
  } catch (error) {
    dispatch({ type: FETCH_FAILURE, error });
  }
};

// State
const initialState = {
  data: [],
  loading: false,
  error: false,
  current: 0,
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
      data: action.data,
      loading: false,
      error: false,
    }),
    [FETCH_FAILURE]: (state, action) => ({
      ...state,
      data: [],
      loading: false,
      error: action.error,
    }),
    SET_CURRENT: (state, action) => ({
      ...state,
      current: action.payload,
    }),
    LIKE: (state, action) => ({
      ...state,
      data: state.data.map((item, idx) => (idx === action.payload ? { ...item, visited: true, status: '💖' } : item)),
    }),
    DISLIKE: (state, action) => ({
      ...state,
      data: state.data.map((item, idx) => (idx === action.payload ? { ...item, visited: true, status: '💔' } : item)),
    }),
    SET_VISITED: (state, action) => ({
      ...state,
      data: state.data.map((item, idx) => (idx === action.payload ? { ...item, visited: true } : item)),
    }),
  },
  initialState,
);

// Selectors
export const getItems = ({ items }) => items.data;
export const getCurrentItem = ({ items }) => items.current;
