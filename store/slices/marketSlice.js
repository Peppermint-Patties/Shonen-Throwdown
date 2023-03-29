import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

export const fetchAllCards = createAsyncThunk('fetchAllCards', async()=>{
    try{
        const {data} = await supabase.from('cards').select('*')
        return data;
    } catch(err){
        console.log(err);
    }
})

const initialState = [];

const MarketSlice = createSlice({
    name: 'market',
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(fetchAllCards.fulfilled, (state,action)=>{
            return action.payload;
        });

    }
});

export const marketCards = (state) => {
    return state.market;
};

export default MarketSlice.reducer;