import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

const initialState = [];

export const fetchCollection = createAsyncThunk('fetchCollection', async(userId)=>{
    try{
        const {data} = await supabase.from('collections').select('*').eq('user_id', userId);
        return data
    } catch(err){
        console.log(err)
    }
});

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchCollection.fulfilled, (state,action)=>{
            return action.payload
        })

    }
});

export const collectionCards = (state) =>{
    return state.collection;
}

export default collectionSlice.reducer;