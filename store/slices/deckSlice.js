import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const fetchDeckCards = createAsyncThunk('fetchDeckCards', async (userId) => {
	console.log('fetch', userId);
	try {
		const deckRow = await supabase.from('decks').select('*').eq('user_id', userId);
		console.log('Row from deck table', deckRow.data[0].card_ids);
		const cards = await supabase.from('cards').select('*').in('id', deckRow.data[0].card_ids);
		console.log('cards', cards.data);
		return cards.data;
	} catch (error) {
		console.log(error);
	}
});

export const updateDeck = createAsyncThunk('removeDeckCard', async ({ updatedArr, userId, returnArr }) => {
	try {
		await supabase.from('decks').update({ card_ids: updatedArr }).eq('user_id', userId).select();
		return returnArr;
	} catch (error) {
		console.log(error);
	}
});

export const addToDeckUpdate = createAsyncThunk('addToDeck', async({updatedArr, userId, newArr})=>{
	try{
		await supabase.from('decks').update({card_ids: updatedArr}).eq('user_id', userId);
		return newArr
	} catch(error){
		console.log(error)
	}
})

const initialState = [];

const DeckSlice = createSlice({
	name: 'deck',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchDeckCards.fulfilled, (state, action) => {
			return action.payload;
		});
		builder.addCase(updateDeck.fulfilled, (state, action) => {
			return action.payload;
		});
		builder.addCase(addToDeckUpdate.fulfilled, (state, action)=>{
			return action.payload;
		})
	}
});

export const selectAllCards = (state) => {
  return state.deck;
};

export default DeckSlice.reducer;
