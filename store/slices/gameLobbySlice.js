import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

const initialState = [];

export const fetchGames = createAsyncThunk('fetchGames', async()=>{
    try{
        const { data } = await supabase.from('game').select('id').eq('isComplete', false);
        return data
    } catch(err){
        console.log(err)
    }
})

const gameLobbySlice = createSlice({
    name: 'gameLobby',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchGames.fulfilled, (state,action)=>{
            return action.payload;
        });
    }
});

export const gameLobby = (state) =>{
    return state.gameLobby;
};

export default gameLobbySlice.reducer