import { createSlice } from '@reduxjs/toolkit';


export const slice = createSlice({
  name: "state",
  initialState: {
    round: {roundNumber:0},
    cards: {},
    refresh: false,
    justFlipped: null,
    wantedCardType: null,
    gameOver: false
  },
  reducers: {
    setDeck: (state,action) => {
      console.log("Setting deck to Redux storage")
      state.cards = action.payload.deck;
    },
    setCard: (state,action) => {
      //console.log(action.payload.card);
        state.cards[action.payload.id]=action.payload.card;
        state.justFlipped=action.payload.card;
      },
      setFlipped: (state, action)=>{
        state.justFlippedType = action.payload;
      },
    incrementRound: (state) => {
      state.roundNumber = state.deck.roundNumber+1;
      },
     setRefresh: (state,action) => {
    state.refresh = action.payload;
  },
     setWanted: (state,action) => {
    state.wantedCardType = action.payload;
  },
     setGameover: (state,action) => {
       state.wantedCardType = action;
     }
},
});

export const { setDeck , setFlipped, setCard, setRefresh, setWanted, setGamestate, selectGamestate, setGameover } = slice.actions;

export const selectDeck = state => state.cards;
export const selectRefresh = state => state.refresh;
export const selectWanted = state => state.wantedCardType;
export const selectFlipped = state => state.justFlipped;
export const selectGameover = state => state.gameOver;


export default slice.reducer;
