import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import toggleReducer from "./slices/toggleSlice";
import deckReducer from "./slices/deckSlice";
import gameReducer from "./slices/gameSlice";
import loadReducer from "./slices/loadSlice";
import marketReducer from './slices/marketSlice'
import collectionReducer from './slices/collectionSlice'
import gameLobbySliceReducer from './slices/gameLobbySlice'


const store = configureStore({
  reducer: {
    user: userReducer,
    toggle: toggleReducer,
    deck: deckReducer, 
    game: gameReducer,
    load: loadReducer,
    market: marketReducer, 
    collection: collectionReducer,
    gameLobby: gameLobbySliceReducer,
  },
});

export default store;
