import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import toggleReducer from './slices/toggleSlice';
import deckReducer from './slices/deckSlice';
import marketReducer from './slices/marketSlice'
import collectionReducer from './slices/collectionSlice'


const store = configureStore({
	reducer: { user: userReducer, toggle: toggleReducer, deck: deckReducer, market: marketReducer, collection: collectionReducer, }
});

export default store;
