import { createSlice } from '@reduxjs/toolkit';


export const slice = createSlice({
  name: "state",
  initialState: {
    round: {roundNumber:0},
    cards: {}
  },
  reducers: {
    setDeck: (state,action) => {
      state.cards = action.payload.deck;
    },
    setCard: (state,action) => {
        state.deck[action.payload.idx]=action.payload;
      },
    incrementRound: (state) => {
      state.roundNumber = state.deck.roundNumber+1;
      },
  },
});

export const { setDeck , setCard } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
/*export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};*/

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDeck = state => state.cards;

export default slice.reducer;
